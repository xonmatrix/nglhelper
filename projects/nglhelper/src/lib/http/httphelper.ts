import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse,
  HttpEvent,
} from '@angular/common/http';
import { forkJoin, Subject, throwError, timer } from 'rxjs';
import {
  map,
  finalize,
  catchError,
  filter,
  distinctUntilChanged,
  debounce,
} from 'rxjs/operators';

import { HttpDataSource, IHttpDataSourceOptions } from './httpdatasource';
import { HttpDatasourceManager } from './httpdatasourcestate';
import { parseJSON } from '../common/parseJSON';

const XSSI_PREFIX = /^\)\]\}',?\n/;

@Injectable({
  providedIn: 'root',
})
export class HttpHelper {
  // State
  public JwtToken: string = '';
  private httpState: any = {};
  private loadingState = new Subject<HttpLoadingState>();
  private errorState = new Subject<HttpErrorState>();
  public ServerError = new Subject<string>();

  static CovertFileToDataUrl(file: File) {
    const p = new Promise((resolve) => {
      const f = new FileReader();
      const listener = () => {
        f.removeEventListener('load', listener);
        resolve(f.result);
      };

      f.addEventListener('load', listener);
      try {
        f.readAsDataURL(file);
      } catch (err) {
        f.removeEventListener('load', listener);
        throw err;
      }
    });

    return p;
  }

  constructor(
    private http: HttpClient,
    private dsStateStorage: HttpDatasourceManager
  ) {}

  Get$(url: string, params?: any) {
    const req = new HttpRequest<any>('GET', url, {
      responseType: 'text',
    });
    return this.Request(req, params);
  }

  Get(url: string, params?: any) {
    return this.Get$(url, params).toPromise();
  }

  GetBlob$(url: string, params?: any) {
    const req = new HttpRequest('GET', url, {
      responseType: 'blob',
    });
    return this.Request(req, params);
  }

  GetBlob(url: string, params?: any) {
    return this.GetBlob$(url, params).toPromise();
  }

  Gets$(...urls: string[]) {
    return forkJoin(urls.map((a) => this.Get$(a)));
  }

  Gets(...urls: string[]) {
    return this.Gets$(...urls).toPromise();
  }

  Post$(url: string, body: any, params?: any) {
    const req = new HttpRequest('POST', url, body, {
      responseType: 'text',
    });
    return this.Request(req, params);
  }

  Post(url: string, body: any, params?: any) {
    return this.Post$(url, body, params).toPromise();
  }

  Delete$(url: string, params?: any) {
    const req = new HttpRequest('DELETE', url, {
      responseType: 'text',
    });
    return this.Request(req, params);
  }

  Delete(url: string, params?: any) {
    return this.Delete$(url, params).toPromise();
  }

  Request(req: HttpRequest<any>, options: any = {}) {
    this.BeginRequest(options.Loader || 'Global');
    if (this.JwtToken) {
      req = req.clone({
        setHeaders: { Authorization: 'Bearer ' + this.JwtToken },
      });
    }
    return this.http
      .request<any>(req)
      .pipe(
        catchError((err) => {
          if (
            err instanceof HttpErrorResponse &&
            !(err.error instanceof Error) &&
            err.status === 500
          ) {
            const contentType = err.headers.get('content-type');
            if (contentType && contentType.indexOf('text/html') >= 0)
              this.ServerError.next(err.error);
          }
          this.ErrorRequest(options.Loader || 'Global', err);
          return throwError(() => err);
        }),
        finalize(() => {
          this.EndRequest(options.Loader || 'Global');
        })
      )
      .pipe(
        filter<HttpEvent<any>>((res: HttpEvent<any>) => {
          return !res || !(res.type !== undefined && res.type === 0);
        }),
        map((resRaw: HttpEvent<any>) => {
          const res: HttpResponse<any> = <HttpResponse<any>>resRaw;
          if (req.responseType !== 'text') return res.body;

          const contentType = res.headers.get('content-type');
          if (contentType && contentType.indexOf('application/json') >= 0) {
            try {
              const body = res.body.replace(XSSI_PREFIX, '');
              const jContent = parseJSON(body);
              if (
                res.headers.has('format') &&
                res.headers.get('format') === 'table'
              ) {
                const results: { Count: any; Data: { [name: string]: any }[] } =
                  {
                    Count: jContent.Count,
                    Data: [],
                  };

                for (let i = 0; i < jContent.Data.length; i++) {
                  const row: { [name: string]: any } = {};
                  for (let j = 0; j < jContent.Cols.length; j++) {
                    row[jContent.Cols[j]] = jContent.Data[i][j];
                  }
                  results.Data.push(row);
                }
                return results;
              }
              return jContent;
            } catch (err) {
              return res.body;
            }
          } else {
            return res.body;
          }
        })
      );
  }

  CreateDataSource(url: string, options?: IHttpDataSourceOptions) {
    return new HttpDataSource(this, this.dsStateStorage, url, options);
  }

  PostFiles$(url: string, data: any, files: Array<any>, params?: any) {
    const formData = new FormData();
    formData.append('$length', files.length + '');
    if (data) formData.append('$formData', JSON.stringify(data));
    for (let i = 0; i < files.length; i++) {
      if (files[i].File)
        formData.append('$file' + i, files[i].File, files[i].File.Name);
      if (files[i].Data)
        formData.append('$data' + i, JSON.stringify(files[i].Data));
    }
    const req = new HttpRequest('POST', url, formData, {
      responseType: 'text',
    });
    return this.Request(req, params);
  }

  PostFiles(url: string, data: any, files: Array<any>, params?: any) {
    return this.PostFiles$(url, data, files, params).toPromise();
  }
  // File Upload.
  UploadFile(url: string, file: File, data: any = null, params?: any) {
    if (typeof file.size !== 'number') {
      throw new TypeError('The file specified is no longer valid');
    }

    const formData = new FormData();
    if (data) {
      formData.append('$data', JSON.stringify(data));
    }

    formData.append('$file', file, file.name);
    const req = new HttpRequest('POST', url, formData, {
      responseType: 'text',
    });
    return this.Request(req, params);
  }

  GetFile$<T>(url: string, data: any = null, params?: any) {
    if (data) {
      const req = new HttpRequest('POST', url, data, {
        responseType: 'blob',
      });
      return this.Request(req, params);
    } else {
      const req = new HttpRequest('GET', url, {
        responseType: 'blob',
      });
      return this.Request(req, params);
    }
  }

  GetFile<T>(url: string, data: any = null, params?: any) {
    return this.GetFile$<T>(url, data, params).toPromise();
  }

  UploadFileAsync(url: string, file: File, data: any = null, params?: any) {
    return this.UploadFile(url, file, data, params).toPromise();
  }

  DownloadBlob(blob: Blob, fileName: string) {
    const a: any = document.createElement('a');
    a.style = 'display: none';
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 100);
  }

  // Loader
  ErrorState(name: string = 'Global') {
    return this.errorState.pipe(
      filter((res) => {
        return res.Name === name;
      }),
      map((res) => {
        return res.Error;
      })
    );
  }

  LoaderState(name: string = 'Global') {
    return this.loadingState.pipe(
      filter((res) => {
        return res.Name === name;
      }),
      distinctUntilChanged(),
      debounce((v) => {
        if (v) {
          return timer(500);
        } else {
          return timer(0);
        }
      }),
      map((a) => {
        return a.IsLoading;
      })
    );
  }

  BeginRequest = (name: string) => {
    this.httpState[name] = this.httpState[name] || 0;
    if (this.httpState[name]++ === 0) {
      try {
        this.errorState.next({
          Name: name,
          Error: '',
        });
        this.loadingState.next({
          Name: name,
          IsLoading: true,
        });
      } catch (err) {}
    }
  };

  EndRequest = (name: string) => {
    if (!this.httpState[name]) {
      return;
    }

    if (--this.httpState[name] === 0) {
      this.loadingState.next({
        Name: name,
        IsLoading: false,
      });
    }
  };

  ErrorRequest = (name: string, error: string) => {
    this.errorState.next({
      Name: name,
      Error: error,
    });
  };

  // Token
  SetBearerToken(token: string) {
    this.JwtToken = token;
  }
}

interface HttpLoadingState {
  Name: string;
  IsLoading: boolean;
}

interface HttpErrorState {
  Name: string;
  Error: string;
}
