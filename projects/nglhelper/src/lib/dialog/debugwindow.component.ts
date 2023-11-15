import {
  Component,
  ViewEncapsulation,
  Input,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import {
  trigger,
  transition,
  style,
  animate,
  query,
  group,
} from '@angular/animations';
import { Subject } from 'rxjs';
import { HttpHelper } from '../http/httphelper';
import { takeUntil } from 'rxjs/operators';

@Component({
  template: `<kendo-dialog
    title="Server Error"
    class="debug-dialog"
    @fadeInAnimation
    [width]="'180px'"
    *ngIf="_show"
    (close)="close()"
  >
    <debugcontent *ngIf="err" [Content]="err!"></debugcontent>
    <iframe #frm (load)="(frm)" class="debug-content"></iframe>
  </kendo-dialog>`,
  selector: 'debugwindow',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./debugcontent.component.scss'],
  animations: [
    trigger('fadeInAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        query('.k-dialog', [style({ transform: 'scale(0)' })]),
        group([
          animate('.2s', style({ opacity: 1 })),
          query('.k-dialog', [
            animate('.2s', style({ transform: 'scale(1)' })),
          ]),
        ]),
      ]),
      transition(':leave', [
        // css styles at start of transition
        query('.k-dialog', [style({ transform: 'scale(1)' })]),
        style({ opacity: 1 }),
        group([
          query('.k-dialog', [
            animate('.2s', style({ transform: 'scale(0)' })),
          ]),
          animate('.1s', style({ opacity: 0 })),
        ]),
      ]),
    ]),
  ],
})
export class DebugWindowComponent implements OnInit, OnDestroy {
  destroy$ = new Subject();
  _show = false;
  err?: string;
  _anm = 'hide';

  @Input('show') set show(val: boolean) {
    this._show = val;
    this._anm = this._show ? 'yes' : 'no';
  }

  constructor(private http: HttpHelper, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.http.ServerError.pipe(takeUntil(this.destroy$)).subscribe((err) => {
      this.show = true;
      this.err = err;
      this.cdr.markForCheck();
    });
  }

  close() {
    this.err = undefined;
    this._show = false;
  }

  ngOnDestroy() {
    this.destroy$.next(0);
  }
}
