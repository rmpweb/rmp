import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromImages from '../../images/reducers';
import { Observable } from 'rxjs/Observable';
@Component({
  selector: 'rm-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {
  images$: Observable<any[]>;

  selectedIndex: number = -1;
  showModal: boolean = false;

  constructor(private store: Store<fromImages.State>) {
    this.images$ = store.select(fromImages.getImagesByType);
  }

  ngOnInit() {
  }


  openModal($event) {
    this.selectedIndex = $event;
    this.showModal = true;
  }

  closeModal($event) {
    this.showModal = false;
  }
}
