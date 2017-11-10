import {RouterModule} from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicLayoutComponent } from './public-layout/public-layout.component';
import { NavItemComponent } from './components/nav-item/nav-item.component';
import { LayoutRoutes } from './layout.routes';
import { PortfolioModule } from '../portfolio/portfolio.module';
import { NavToggleComponent } from './components/nav-toggle/nav-toggle.component';
import { BrowserModule } from '@angular/platform-browser';
import { GalleryModule } from '../gallery/gallery.module';
import { ContactModule } from '../contact/contact.module';
import { AboutModule } from '../about/about.module';
import { NavGroupComponent } from './components/nav-group/nav-group.component';

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    RouterModule.forChild(LayoutRoutes),
    GalleryModule,
    ContactModule,
    AboutModule
  ],
  declarations: [
    PublicLayoutComponent,
    NavItemComponent,
    NavToggleComponent,
    NavGroupComponent
  ],
  exports: [
    PublicLayoutComponent
  ]
})
export class LayoutModule { }
