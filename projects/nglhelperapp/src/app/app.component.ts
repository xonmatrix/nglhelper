import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  filterTypes: Array<any> = [
    { Type: 'None', Display: 'None', Field: '' },
    { Type: 'PassNo', Display: 'Pass No', Field: 'text' },
    { Type: 'Name', Display: 'Name', Field: 'text' },
    {
      Type: 'ClassificationId',
      Display: 'Classification',
      Field: 'dropdown',
      SourceTable: '/api/staff/classification/list',
    },
  ];
}
