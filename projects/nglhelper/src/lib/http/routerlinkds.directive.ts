import { Directive, HostListener, Input } from '@angular/core';
import { HttpDatasourceManager } from './httpdatasourcestate';
import { ActivatedRoute, Router } from '@angular/router';

@Directive({
  selector: '[routerLinkDS]',
})
export class RouterLinkDSDirective {
  @Input('routerLinkDS') routerLinkDS?: string;

  constructor(
    private dsStateManager: HttpDatasourceManager,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  @HostListener('click', ['$event'])
  clickEvent(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.dsStateManager.usePreviousState();
    this.router.navigate([this.routerLinkDS], { relativeTo: this.route });
  }
}
