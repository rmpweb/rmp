import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'rm-nav-group',
  templateUrl: './nav-group.component.html',
  styleUrls: ['./nav-group.component.scss']
})
export class NavGroupComponent implements OnInit {
  @Input() label: string;
  open:boolean =false;
  active:boolean = false;
  
  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

}
