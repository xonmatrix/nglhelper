import { Component, OnInit, OnDestroy } from "@angular/core";
import { DialogHelper, HttpHelper, PresistStateMode } from "nglhelper";
import { Router } from '@angular/router';

@Component({
  templateUrl: "./stafflist.component.html"
})
export class StaffListComponent implements OnInit {
  ds = this.http.CreateDataSource("/api/staff/query", {
    loader: "table",
    paging: true,
    serverSide: true,
    presistState: "Staff_Table",
    presistStateMode: PresistStateMode.PresistWhenIndicated,
    initFilter: {
      IsActive: 1
    }
  });

  moduleRightLevel = 0;
  readOnly = false;

  constructor(private http: HttpHelper, private dialog: DialogHelper,private router:Router) {}

  filterTypes: Array<any> = [
    { Type: "None", Display: "None", Field: "" },
    { Type: "PassNo", Display: "Pass No", Field: "text" },
    { Type: "Name", Display: "Name", Field: "text" },
    {
      Type: "ClassificationId",
      Display: "Classification",
      Field: "dropdown",
      SourceTable: "/api/staff/classification/list"
    },
    {
      Type: "DesignationId",
      Display: "Designation",
      Field: "multi",
      SourceTable: "/api/staff/designation/list"
    },
    {
      Type: "DepartmentId",
      Display: "Department",
      Field: "multi",
      SourceTable: "/api/staff/department/list"
    }
  ];

  ngOnInit() {
    //  this.ds.SetFilter(this.filterStaffStatus);
    
  }

  gogo(){
    this.router.navigateByUrl("/staff/form");
  }
  rowStyle(context) {
    return {
      "row-inactive": !context.dataItem.IsActive
    };
  }

  async remove(item: any) {
    if (
      await this.dialog.Confirm("Are you sure to remove [" + item.Name + "]?")
    ) {
      try {
        await this.http.Delete("/api/staff/" + item.Id);
        this.dialog.ToastSuccess("Operation Success", `${item.Name} removed.`);
        this.ds.Refresh();
      } catch (err) {
        this.dialog.AlertError(err);
      }
    }
  }
}
