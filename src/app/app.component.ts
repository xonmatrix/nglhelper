import { Component } from "@angular/core";
import { HttpDatasourceManager, HttpHelper } from "nglhelper";
import { Router } from "@angular/router";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html"
})
export class AppComponent {
  constructor(
    private xx: HttpDatasourceManager,
    private http: HttpHelper,
    private router: Router
  ) {}

  async go() {
   var res = await this.http.Post('/api/test',{});
  }
}
