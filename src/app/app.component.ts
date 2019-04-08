import { Component } from "@angular/core";
import { HttpDatasourceStateManager } from "projects/nglhelper/src/lib/http/httpdatasourcestate";
import { Router } from "@angular/router";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html"
})
export class AppComponent {
  constructor(private xx: HttpDatasourceStateManager, private router: Router) {}

  go() {
    this.xx.revertState();
    this.router.navigateByUrl('/stafflist');
  }
}
