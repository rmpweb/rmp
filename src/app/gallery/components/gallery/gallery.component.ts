import {ActivatedRoute} from '@angular/router';
import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromImages from '../../images/reducers';
import * as images from '../../images/actions/images';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
@Component({
  selector: 'rm-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnDestroy {
  images$: Observable<any[]>;

  selectedIndex: number = -1;
  showModal: boolean = false;
  actionSubscription: Subscription;

  constructor(private store: Store<fromImages.State>, private activatedRoute: ActivatedRoute) {
    this.actionSubscription = this.activatedRoute.url
      .map(url=> new images.SetTagFilterAction(url[0].path))  
      .subscribe(store);
    this.images$ = store.select(fromImages.getImagesByType);
  }

  ngOnDestroy() {
    this.actionSubscription.unsubscribe();
  }


  openModal($event) {
    this.selectedIndex = $event;
    this.showModal = true;
  }

  closeModal($event) {
    this.showModal = false;
  }
}
