import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImagesApiService } from './services/images.api.service';
import { HttpModule } from '@angular/http';

@NgModule({
  imports: [
    CommonModule,
    HttpModule
  ],
  declarations: [],
  providers: [ImagesApiService]
})
export class SharedModule { }
