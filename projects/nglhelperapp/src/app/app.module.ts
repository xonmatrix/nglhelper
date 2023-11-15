import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { HttpHelperModule, TableFilterModule } from 'nglhelper';
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    TableFilterModule,
    HttpHelperModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
