import {
  Component,
  ViewEncapsulation,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  trigger,
  transition,
  style,
  animate,
  query,
  group,
} from '@angular/animations';

@Component({
  template: `<kendo-dialog class="loadingDialog" @fadeInAnimation *ngIf="_show">
    <div
      style="padding:0px 15px;flex-direction:row;display:flex;align-items:center;align-content:center;width:230px"
    >
      <div style="font-family: 'Oswald', font-size:18px;margin-left:40px">
        Fetching Data
      </div>
      <img
        src="assets/images/loading.gif"
        style="height:60px;margin-left:20px"
      />
    </div>
  </kendo-dialog>`,
  selector: 'loadingoverlay',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./loadingoverlay.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
export class LoadingOverlayComponent {
  _show = false;
  _anm = 'hide';
  @Input('show') set show(val: boolean) {
    this._show = val;
    this._anm = this._show ? 'yes' : 'no';
  }
}
