import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AppComponent } from "./app.component";
import { DialogsModule } from "@progress/kendo-angular-dialog";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { GridModule } from "@progress/kendo-angular-grid";
import { DialogHelperModule, LoadingOverlayModule } from "nglhelper"; 
import {MatRadioModule} from "@angular/material/radio";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";

import "hammerjs";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { DropDownsModule } from "@progress/kendo-angular-dropdowns";
import { HttpClientModule } from "@angular/common/http";
import {HttpHelperModule} from 'nglhelper';

const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "/staff/list" },
  { path:"staff",loadChildren:() => import('./staff/staff.module').then(m => m.StaffModule)}
];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    DialogsModule,
    BrowserAnimationsModule,
    GridModule,
    DialogHelperModule,
    MatRadioModule,
    MatIconModule,
    MatButtonModule,
    LoadingOverlayModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    DropDownsModule,
    HttpHelperModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
