// import { any } from '../models/any';
import * as images from '../actions/images';
import * as _ from 'lodash';

export interface State {
    loaded: boolean;
    loading: boolean;
    images: any[];
    selectedanyId: string;
}

export const initialState: State = {
    loaded: false,
    loading: false,
    images: [],
    selectedanyId: null
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
        case images.SELECT: {
            return Object.assign({},state,{
                selectedanyId: action.payload
            })
        }
        case images.DESELECT: {
            return Object.assign({},state,{
                selectedanyId: null
            })
        }
        default: {
            return state;
        }
    }

}

export const getAllImages = (state: State) => state.images;