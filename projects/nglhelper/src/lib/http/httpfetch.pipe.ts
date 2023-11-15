import { Pipe, PipeTransform } from '@angular/core';
import { HttpHelper } from './httphelper';

@Pipe({
  name: 'fetch',
  pure: true,
})
export class FetchPipe implements PipeTransform {
  constructor(private http: HttpHelper) {}

  transform(url: string): any {
    return this.http.Get$(url);
  }
}
