import { Directive, HostListener, Input } from "@angular/core";
import { HttpDatasourceManager } from "./httpdatasourcestate";

@Directive({
  selector: "[routerLinkDS]"
})
export class RouterLinkDSDirective {
  @Input("routerLinkDS") routerLinkDS: string;
  constructor(private dsStateManager: HttpDatasourceManager) {}

  @HostListener("click", ["$event"])
  clickEvent(event) {
    event.preventDefault();
    event.stopPropagation();
    this.dsStateManager.usePreviousState(this.routerLinkDS);
  }
}
