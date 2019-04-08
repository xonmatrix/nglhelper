import { Injectable } from "@angular/core";
import { Router, ActivationEnd, ResolveEnd } from "@angular/router";

@Injectable({ providedIn: "root" })
export class HttpDatasourceStateManager {
  private objectState: any = {};
  private shouldReloadState = true;
  private loaded = false;
  private loadStateIndicator = false;

  get ShouldReloadDsState() {
    return this.shouldReloadState;
  }

  constructor(private router: Router) {
    this.router.events.subscribe(res => {
      if (res instanceof ActivationEnd) {
        this.loaded = true;
      } else if (res instanceof ResolveEnd) {
        if (this.loaded) this.shouldReloadState = false;

        if (this.loadStateIndicator) this.shouldReloadState = true;

        this.loadStateIndicator = false;
      }
    });
  }

  revertState() {
    this.loadStateIndicator = true;
    this.shouldReloadState = true;
  }

  getState(dsName: string) {
    const stateName = this.getStateName(dsName);
    let state = this.objectState[stateName];
    if (!state) {
      const stateStr = sessionStorage.getItem(stateName);
      if (stateStr != null) {
        state = JSON.parse(stateStr);
        this.objectState[stateName] = state;
      }
    }

    return state;
  }

  setState(dsName: string, state: any) {
    const stateName = this.getStateName(dsName);
    this.objectState[stateName] = state;
    sessionStorage.setItem(stateName, JSON.stringify(state));
  }

  private getStateName(dsName: string) {
    return `${dsName}_DSSTATE`;
  }
}
