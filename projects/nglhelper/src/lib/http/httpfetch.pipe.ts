import { Pipe, PipeTransform } from '@angular/core';
import { HttpHelper } from './HttpHelper';

@Pipe({
    name: 'fetch',
    pure: true
})
export class FetchPipe implements PipeTransform {

    constructor(private http: HttpHelper) {
        console.log('??');
    }

    transform(url: string): any {
        return this.http.Get$(url);
    }
}
