import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private client: HttpClient) {
  }

  getItems(): Observable<any[]> {
    return this.client.get<any[]>('http://openhabianpi:8080/rest/items');
  }

  saveItem(item: any): Observable<Object> {
    return this.client.put('http://openhabianpi:8080/rest/items/' + item.name, item);
  }
}
