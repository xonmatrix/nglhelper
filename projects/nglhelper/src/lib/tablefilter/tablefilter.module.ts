import { NgModule } from "@angular/core";
import { DropDownsModule } from "@progress/kendo-angular-dropdowns";
import { TableFilterComponent } from "./tablefilter.component";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

@NgModule({
  imports: [DropDownsModule,CommonModule,FormsModule],
  declarations: [TableFilterComponent],
  exports: [TableFilterComponent],
})
export class TableFilterModule {}
