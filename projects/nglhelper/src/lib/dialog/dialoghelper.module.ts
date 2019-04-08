import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopUpDialogComponent } from './PopUpDialog.component';
import { DebugWindowComponent } from './debugwindow.component';
import { DebugContentComponent } from './debugcontent.component';
import { MatButtonModule, MatDialogModule, MatIconModule } from '@angular/material';
import { DialogsModule } from '@progress/kendo-angular-dialog';
@NgModule({
    imports: [CommonModule, MatButtonModule, MatDialogModule, MatIconModule, DialogsModule],
    declarations: [PopUpDialogComponent, DebugWindowComponent, DebugContentComponent],
    entryComponents: [PopUpDialogComponent],
    exports: [PopUpDialogComponent, DebugWindowComponent]
})
export class DialogHelperModule { }
