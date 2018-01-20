import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromImages from '../../images/reducers';

@Component({
  selector: 'rm-gallery-grid',
  templateUrl: './gallery-grid.component.html',
  styleUrls: ['./gallery-grid.component.scss']
})
export class GalleryGridComponent implements OnInit {
  @Input() photos: any[] = null;
  @Output() openModalEvent: EventEmitter<number> = new EventEmitter<number>();
  constructor() {

   }


  ngOnInit() {
  
  }

  openModal(index: any) {
    // debugger;
    this.openModalEvent.emit(index);
  }

}

