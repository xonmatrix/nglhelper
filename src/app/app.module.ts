import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AppComponent } from "./app.component";
import { DialogsModule } from "@progress/kendo-angular-dialog";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { GridModule } from "@progress/kendo-angular-grid";
import { DialogHelperModule, LoadingOverlayModule } from "nglhelper"; 
import {
  MatRadioModule,
  MatIconModule,
  MatButtonModule
} from "@angular/material";
import "hammerjs";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { TableFilterComponent } from "./common/components/tablefilter.component";
import { DropDownsModule } from "@progress/kendo-angular-dropdowns";
import { HttpClientModule } from "@angular/common/http";

import { StaffListComponent } from "./staff/stafflist.component";
import { StaffFormComponent } from "./staff/staffform.component";

const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "/stafflist" },
  { path: "stafflist", component: StaffListComponent },
  { path: "staffform", component: StaffFormComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    TableFilterComponent,
    StaffListComponent,
    StaffFormComponent
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
    DropDownsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
