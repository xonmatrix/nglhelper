import {
  Component,
  ViewEncapsulation,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  template: ` <iframe #frm [outerHTML]="html" class="debug-content"></iframe> `,
  selector: 'debugcontent',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DebugContentComponent {
  html?: SafeHtml;
  @Input('Content') set Content(html: string) {
    this.html = this.ds.bypassSecurityTrustHtml(html);
  }
  constructor(private ds: DomSanitizer) {}
}
