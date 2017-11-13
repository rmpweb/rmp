import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleryComponent } from './components/gallery/gallery.component';
import { GalleryGridComponent } from './components/gallery-grid/gallery-grid.component';
import { reducers } from './images/reducers/index';
import { ImagesEffects } from './images/effects/images';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { SharedModule } from '../shared/shared.module';
import { GalleryModalComponent } from './components/gallery-modal/gallery-modal.component';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    SharedModule,
    StoreModule.forFeature('images', reducers),
    EffectsModule.forFeature([ImagesEffects])
  ],
  declarations: [GalleryComponent, GalleryGridComponent, GalleryModalComponent]
})
export class GalleryModule { }
