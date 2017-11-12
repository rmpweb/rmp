import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {Observable} from 'rxjs/Rx';

@Injectable()
export class GalleryApiService {
  private url: string = 'https://api.flickr.com/services/rest/';

  constructor(private http: Http) {

  }

  getPhotos(params: any): Observable<any[]> {
    console.log('starting');
    return this.http.get(this.url, {search: params})

      .map((r: Response) => r.json().photos.photo.map(photo => {
        photo.url = `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_z.jpg`;
        photo.urlb = `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_b.jpg`;
        return photo;
      }))
    //   .catch(error => console.log(error));
  }
}
