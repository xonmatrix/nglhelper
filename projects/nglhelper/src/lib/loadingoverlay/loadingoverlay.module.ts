import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingOverlayComponent } from './loadingoverlay.component';
import { DialogModule } from '@progress/kendo-angular-dialog';
@NgModule({
    imports: [DialogModule, CommonModule],
    declarations: [LoadingOverlayComponent],
    exports: [LoadingOverlayComponent]
})
export class LoadingOverlayModule { }
