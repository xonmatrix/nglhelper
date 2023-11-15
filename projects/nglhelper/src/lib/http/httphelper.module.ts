import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FetchPipe } from './httpfetch.pipe';
import { RouterLinkDSDirective } from './routerlinkds.directive';

@NgModule({
  imports: [HttpClientModule],
  declarations: [FetchPipe, RouterLinkDSDirective],
  exports: [FetchPipe, RouterLinkDSDirective],
})
export class HttpHelperModule {}
