import { NgModule } from "@angular/core";
import { FetchPipe } from "./httpfetch.pipe";
import { HttpClientModule } from "@angular/common/http";
import { RouterLinkDSDirective } from "./routerlinkds.directive";

@NgModule({
  imports: [HttpClientModule],
  declarations: [FetchPipe, RouterLinkDSDirective],
  exports: [FetchPipe, RouterLinkDSDirective]
})
export class HttpHelperModule {}
