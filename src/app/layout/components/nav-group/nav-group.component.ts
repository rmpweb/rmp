import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'rm-nav-group',
  templateUrl: './nav-group.component.html',
  styleUrls: ['./nav-group.component.scss']
})
export class NavGroupComponent implements OnInit {
  @Input() label: string;
  open:boolean =false;
  active:boolean = false;
  routerSubscription: Subscription;
  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

}
