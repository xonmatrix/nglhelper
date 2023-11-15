import { Component, Inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    template: `<div style="min-width:350px;border:1px solid transparent" >
                  <div *ngIf="data.title" class='title' [style.color]="data.titleColor"  style="display:flex;flex-direction:row;align-items:center"  mat-dialog-title><mat-icon style="margin-right:10px" *ngIf="data.icon" >{{data.icon}}</mat-icon> {{data.title}}</div>
                  <mat-dialog-content>
                        <pre class='message'>{{data.message}}</pre>
                  </mat-dialog-content>
                  <mat-dialog-actions>
                  <div style="text-align:right;width:100%;">
                        <button mat-button #btns *ngFor="let b of data.buttons" (click)="dialogRef.close(b.Id)" >{{b.Name}}</button>
                  </div>
                  </mat-dialog-actions>
                </div>`,
    styles: [
        `.title{
            font-size:14pt;
            font-weight:bold;
        }`,
        `.message{
            font-family:'roboto',serif;
            font-size:11pt;
            min-height:80px;
        }`
    ],
    changeDetection: ChangeDetectionStrategy.OnPush

})
export class PopUpDialogComponent {

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<PopUpDialogComponent>, private cdf: ChangeDetectorRef) {

    }
}
