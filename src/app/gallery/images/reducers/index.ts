import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as fromImages from './images';
import * as fromRoot from '../../../reducers';

export interface ImagesState {
    images: fromImages.State;
}

export interface State extends fromRoot.State {
    'images': ImagesState;
}

export const reducers = {
    images: fromImages.reducer
};

export const getImagesState = createFeatureSelector<ImagesState>('images');

export const getImageEntitiesState = createSelector(
    getImagesState,
    (state: ImagesState) => state.images
);

export const getAllImages = createSelector(
    getImageEntitiesState,
    fromImages.getAllImages
);