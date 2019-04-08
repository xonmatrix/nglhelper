import { NgModule } from '@angular/core';
import { FetchPipe } from './httpfetch.pipe';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
    imports: [HttpClientModule],
    declarations: [FetchPipe],
    exports: [FetchPipe]
})
export class HttpHelperModule {

}