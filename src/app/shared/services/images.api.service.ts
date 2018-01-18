import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions, URLSearchParams} from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {Observable} from 'rxjs/Rx';

@Injectable()
export class ImagesApiService {
  private url: string = 'https://api.flickr.com/services/rest/';
  params: URLSearchParams; 

  constructor(private http: Http) {
    this.params= new URLSearchParams();
    this.params.set('api_key','817482a69233f8e2658ef5b1d99bc0fc');
    this.params.set('user_id','73446669@N05');
    this.params.set('format','json');
    this.params.set('nojsoncallback','1');
    this.params.set('method','flickr.people.getPhotos');
    this.params.set('extras', 'tags,url_o');
  }




  getPhotos(): Observable<any[]> {
    console.log('starting');
    return this.http.get(this.url, {search: this.params})

      .map((r: Response) => r.json().photos.photo.map(photo => {
        photo.url = `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_z.jpg`;
        photo.urlb = `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_b.jpg`;
        return photo;
      }));
    //   .catch(error => console.log(error));
  }







}
