import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'rm-public-layout',
  templateUrl: './public-layout.component.html',
  styleUrls: ['./public-layout.component.scss']
})
export class PublicLayoutComponent implements OnInit {

  isNavMenuOpen:boolean = false;
  constructor(
    private router: Router
  ) {
  }

  ngOnInit(){
    this.router.events.subscribe(event => this.isNavMenuOpen = false);
  }

  onMenuClick() {
    console.log('clicked');
    this.isNavMenuOpen = !this.isNavMenuOpen;
  }

}
