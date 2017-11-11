import { Component, OnInit, Input } from '@angular/core';

export interface NavItem{
  navLink: string;
  label: string;
}

@Component({
  selector: 'rm-nav-item',
  templateUrl: './nav-item.component.html',
  styleUrls: ['./nav-item.component.scss']
})
export class NavItemComponent implements OnInit {
  @Input() navLink: string;
  @Input() label: string;
  constructor() { }

  ngOnInit() {
  }

}
