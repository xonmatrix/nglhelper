import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpHelper } from './httphelper';
import { HttpDatasourceManager } from './httpdatasourcestate';

export class HttpDataSource {
  Result = new Observable<any>();

  Error = new Subject<string>();
  refreshSub = new Subject<any>();

  // public state
  Limit = 30;
  OffSet = 0;
  Count = 0;
  Sort?: Array<{ dir: string; field: string }>;
  Loading$: Observable<boolean>;
  // private property
  subCount = 0;
  filter: any = {};
  tableFilter: any = {};

  _filter: any = null;
  _tableFilter: any = {};

  items: Array<any> = [];

  constructor(
    private http: HttpHelper,
    private dsManager: HttpDatasourceManager,
    private url: string,
    private options: IHttpDataSourceOptions = {}
  ) {
    // setup default options.
    if (options.compress === undefined) options.compress = false;

    if (options.serverSide === undefined) options.serverSide = false;

    if (options.loader === undefined) options.loader = 'Global';

    if (options.method === undefined) options.method = 'AUTO';

    if (options.paging === undefined) options.paging = false;

    if (options.presistStateMode === undefined)
      options.presistStateMode = PresistStateMode.PresistAll;

    this.Loading$ = this.http.LoaderState(options.loader);

    let state = null;

    if (
      options.presistState &&
      (options.presistStateMode == PresistStateMode.PresistAll ||
        (options.presistStateMode == PresistStateMode.PresistWhenIndicated &&
          this.dsManager.ShouldReloadDsState))
    ) {
      state = this.dsManager.getState(options.presistState);

      if (state) {
        this.Limit = state.Limit;
        this.OffSet = state.Offset;
        this.Sort = state.Sort;

        this._filter = state.filter;
        this.filter = this._filter;
        this._tableFilter = state.tableFilter;
        this.tableFilter = this._tableFilter;
      }
    }

    if (!state) {
      if (options.initFilter) {
        this._filter = options.initFilter;
        this.filter = this._filter;
      }

      if (options.initPagesize) {
        this.Limit = options.initPagesize;
      }
    }

    this.Result = new Observable((observer) => {
      const sub = this.refreshSub.subscribe(observer);
      this.subCount++;
      if (this.subCount === 1) {
        observer.next([]);
        this.Refresh();
      }
      return () => {
        sub.unsubscribe();
        this.subCount--;
      };
    });
    this.Result = new Observable((observer) => {
      const sub = this.refreshSub.subscribe(observer);
      this.subCount++;
      if (this.subCount === 1) {
        observer.next([]);
        this.Refresh();
      }
      return () => {
        sub.unsubscribe();
        this.subCount--;
      };
    });
  }

  private storeState() {
    if (!this.options.presistState) return;
    const state: any = {
      Limit: this.Limit,
      Offset: this.OffSet,
      Sort: this.Sort,
      filter: this._filter,
    };
    if (this._tableFilter) state.tableFilter = this._tableFilter;
    this.dsManager.setState(this.options.presistState, state);
  }

  SetUrl(url: string) {
    this.url = url;
    this.Refresh();
  }

  ApplyFilter() {
    this._filter = this.filter;
    this._tableFilter = this.tableFilter;
    this.OffSet = 0;
    this.Refresh();
  }

  ClearFilter() {
    this._tableFilter = {};
    this.tableFilter = {};
    this._filter = this.options.initFilter || null;
    this.filter = this.options.initFilter || null;
    this.OffSet = 0;
    this.Refresh();
  }

  SetFilter(filter: any) {
    this.filter = filter;
    this.Refresh();
  }

  SetSource(url: string, filter: object) {
    this.url = url;
    this.filter = filter;
    this.OffSet = 0;
    this.Refresh();
  }

  PageChanged(e: { skip: number; take: number }) {
    this.OffSet = e.skip;
    this.Limit = e.take;
    this.Refresh();
  }

  SetSort(sort: { dir: string; field: string }[]) {
    this.Sort = sort;
    this.Refresh();
  }

  SetOffset(offset: number) {
    this.OffSet = offset;
    if (this.options.serverSide) this.Refresh();
    else {
      this.refreshSub.next({
        total: this.items.length,
        data: this.items.slice(this.OffSet, this.OffSet + this.Limit),
      });
    }
  }

  GenerateReq(ignorePaging = false) {
    // generate filter;
    let body: any = null;
    // apply filter;
    if (this._filter) {
      body = Object.assign(body || {}, this._filter);
    }

    if (this._tableFilter) Object.assign(body || {}, this._tableFilter);

    if (!ignorePaging && this.options.paging && this.options.serverSide) {
      body = Object.assign(body || {}, {
        Offset: this.OffSet,
        Limit: this.Limit,
      });
    }

    if (this.Sort && this.Sort.length && this.options.serverSide) {
      const s: { [name: string]: boolean } = {};
      for (let i = 0; i < this.Sort.length; i++) {
        if (this.Sort[i].dir) {
          s[this.Sort[i].field] = this.Sort[i].dir === 'asc';
        }
      }
      body = Object.assign(body || {}, {
        Sort: s,
      });
    }

    let req;
    if (
      (this.options.method === 'AUTO' && body) ||
      this.options.method === 'POST'
    )
      req = this.generatePostReq(body || {});
    else req = this.generateGetReq(body);

    req = req.pipe(
      map((res: any) => {
        if (!this.options.serverSide) this.items = res;

        if (this.options.paging) {
          if (this.options.serverSide) {
            this.Count = res.Count;
            return {
              total: res.Count,
              data: res.Data,
            };
          } else {
            this.Count = this.items.length;
            return {
              total: this.items.length,
              data: this.items.slice(this.OffSet, this.OffSet + this.Limit),
            };
          }
        } else {
          this.Count = res.length;
          return res;
        }
      })
    );

    return req;
  }

  Refresh() {
    if (this.subCount === 0 || this.url === '') return;

    this.storeState();
    this.GenerateReq().subscribe(
      (res) => {
        this.refreshSub.next(res);
      },
      (err) => {
        if (err instanceof Error) {
          this.Error.next(err.message);
        } else this.Error.next(err);
      }
    );
  }

  private generatePostReq(body: any) {
    return this.http.Post$(this.url, body, {
      Loader: this.options.loader,
    });
  }

  private generateGetReq(body: any) {
    // TODO: support GET with filter + Paging
    return this.http.Get$(this.url, {
      Loader: this.options.loader,
    });
  }
}

export interface IHttpDataSourceOptions {
  presistState?: string;
  presistStateMode?: PresistStateMode;
  paging?: boolean;
  serverSide?: boolean;
  compress?: boolean; // TODO as well :)
  loader?: string;
  method?: string;
  initFilter?: object;
  initPagesize?: number;
}

export enum PresistStateMode {
  PresistAll,
  PresistWhenIndicated,
}
