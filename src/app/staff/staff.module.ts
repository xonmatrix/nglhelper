import { NgModule } from "@angular/core";
import { StaffListComponent } from "./stafflist.component";
import { StaffFormComponent } from "./staffform.component";
import { DialogsModule } from "@progress/kendo-angular-dialog";
import { DropDownsModule } from "@progress/kendo-angular-dropdowns";
import { GridModule } from "@progress/kendo-angular-grid";
import {MatRadioModule} from "@angular/material/radio";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule}  from "@angular/material/button";
import { RouterModule, Routes } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { TableFilterComponent } from "../common/components/tablefilter.component";
import {HttpHelperModule} from 'nglhelper';
const routes: Routes = [
  { path: "list", component: StaffListComponent },
  { path: "form", component: StaffFormComponent }
];
@NgModule({
  imports: [
    DialogsModule,
    GridModule,
    MatRadioModule,
    MatIconModule,
    MatButtonModule,
    DropDownsModule,
    FormsModule,
    CommonModule,
    RouterModule.forChild(routes),
    HttpHelperModule
  ],
  declarations: [TableFilterComponent,StaffListComponent, StaffFormComponent]
})
export class StaffModule {}
