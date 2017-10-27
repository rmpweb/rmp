import {RouterModule} from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicLayoutComponent } from './public-layout/public-layout.component';
import { NavMenuComponent } from './components/nav-menu/nav-menu.component';
import { NavItemComponent } from './components/nav-item/nav-item.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(LayoutRoutes)
  ],
  declarations: [
    PublicLayoutComponent,
    NavMenuComponent,
    NavItemComponent
  ],
  exports: [
    PublicLayoutComponent
  ]
})
export class LayoutModule { }
