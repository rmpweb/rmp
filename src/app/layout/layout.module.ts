import {RouterModule} from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicLayoutComponent } from './public-layout/public-layout.component';
import { NavItemComponent } from './components/nav-item/nav-item.component';
import { LayoutRoutes } from './layout.routes';
import { PortfolioModule } from '../portfolio/portfolio.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(LayoutRoutes),
    PortfolioModule
  ],
  declarations: [
    PublicLayoutComponent,
    NavItemComponent
  ],
  exports: [
    PublicLayoutComponent
  ]
})
export class LayoutModule { }
