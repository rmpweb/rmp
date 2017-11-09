import { Component, OnInit, Input, EventEmitter, Output, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'rm-nav-toggle',
  templateUrl: './nav-toggle.component.html',
  styleUrls: ['./nav-toggle.component.scss'],
  encapsulation: ViewEncapsulation.None 
})
export class NavToggleComponent implements OnInit {

  // @Output() onToggle: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

}
