import { NgModule } from "@angular/core";
import { DropDownsModule } from "@progress/kendo-angular-dropdowns";
import { TableFilterComponent } from "./tablefilter.component";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { FlexLayoutModule } from "@angular/flex-layout";

@NgModule({
  imports: [DropDownsModule,CommonModule,FormsModule,FlexLayoutModule],
  declarations: [TableFilterComponent],
  exports: [TableFilterComponent],
})
export class TableFilterModule {}
