import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/catch';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';


import * as images from '../actions/images';
import { ImagesApiService } from '../../../shared/services/images.api.service';


@Injectable()
export class ImagesEffects {
    @Effect()
    loadImages$: Observable<Action> = this.actions$
        .ofType(images.LOAD)
        .switchMap(() =>
            this.imagesApiService.getPhotos()
                .map((response: any[]) => new images.LoadSuccessAction(response))
                .catch(error => of(new images.LoadFailAction(error)))
        );

    constructor(
        private actions$: Actions,
        private imagesApiService: ImagesApiService
    ) { }
}