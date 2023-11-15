import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopUpDialogComponent } from './popupdialog.component'
import { DebugWindowComponent } from './debugwindow.component';
import { DebugContentComponent } from './debugcontent.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { DialogsModule } from '@progress/kendo-angular-dialog';
@NgModule({
    imports: [CommonModule, MatButtonModule, MatDialogModule, MatIconModule, DialogsModule],
    declarations: [PopUpDialogComponent, DebugWindowComponent, DebugContentComponent],
    exports: [ DebugWindowComponent]
})
export class DialogHelperModule { }
