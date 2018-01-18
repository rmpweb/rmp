import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as images from '../../gallery/images/actions/images';
import * as fromImages from '../../gallery/images/reducers';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Rx';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

@Component({
  selector: 'rm-public-layout',
  animations: [
    trigger('fadeOut', [
      state('loading', style({ opacity: 1 })),
      state('void', style({ opacity: 0 })),
      transition('loading => void', animate('1000ms ease-in-out')),
    ])
  ],
  templateUrl: './public-layout.component.html',
  styleUrls: ['./public-layout.component.scss']
})
export class PublicLayoutComponent implements OnInit {

  isNavMenuOpen: boolean = false;
  loaded$: Observable<boolean>;
  constructor(
    private router: Router,
    private store: Store<fromImages.State>
  ) {
    this.loaded$ = store.select(fromImages.getHasLoaded);
  }

  ngOnInit() {
    this.router.events.subscribe(event => this.isNavMenuOpen = false);
    this.store.dispatch(new images.LoadAction());
  }

  onMenuClick() {
    // debugger;
    console.log('clicked');
    this.isNavMenuOpen = !this.isNavMenuOpen;
  }

}
