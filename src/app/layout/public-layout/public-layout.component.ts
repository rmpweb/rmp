import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as images from '../../gallery/images/actions/images';
import * as fromImages from '../../gallery/images/reducers';
import { Store } from '@ngrx/store';

@Component({
  selector: 'rm-public-layout',
  templateUrl: './public-layout.component.html',
  styleUrls: ['./public-layout.component.scss']
})
export class PublicLayoutComponent implements OnInit {

  isNavMenuOpen:boolean = false;
  constructor(
    // private router: Router,
    public store: Store<fromImages.State>
  ) {
  }

  ngOnInit(){
    // this.router.events.subscribe(event => this.isNavMenuOpen = false);
    this.store.dispatch(new images.LoadAction());
  }

  onMenuClick() {
    // debugger;
    console.log('clicked');
    this.isNavMenuOpen = !this.isNavMenuOpen;
  }

}
