// import { any } from '../models/any';
import * as images from '../actions/images';
import * as _ from 'lodash';

export interface State {
    loaded: boolean;
    loading: boolean;
    images: any[];
    tagFilter: string;
}

export const initialState: State = {
    loaded: false,
    loading: false,
    images: [],
    tagFilter: null,
}

export function reducer(state = initialState, action: images.Actions): State {
    switch (action.type) {
        case images.LOAD: {
            return Object.assign({}, state,{
                loaded: false,
                loading: true,
                images: []
            })  
        }
        case images.LOAD_SUCCESS: {
            const images = action.payload;
            return Object.assign({}, state,{
                loaded: true,
                loading: false,
                images: images,
            })  
        }
        case images.LOAD_FAIL: {
            return initialState;
        }
        case images.SET_TAG_FILTER: {
            return Object.assign({},state,{
                tagFilter: action.payload
            })
        }
        case images.RESET_TAG_FILTER: {
            return Object.assign({},state,{
                tagFilter: null
            })
        }
        default: {
            return state;
        }
    }

}

export const getAllImages = (state: State) => state.images;
export const getImagesByType = (state: State) =>  ((state.tagFilter === 'overview') || (state.tagFilter===null))? state.images: _.filter(state.images, image => (image.tags.indexOf(state.tagFilter) !== -1));

export const getHasLoaded = (state: State) => state.loaded;