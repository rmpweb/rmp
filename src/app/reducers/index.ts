import {
    ActionReducerMap,
    createSelector,
    createFeatureSelector,
    ActionReducer,
    MetaReducer,
  } from '@ngrx/store';
  import { environment } from '../../environments/environment';
  
  import * as fromRouter from '@ngrx/router-store';
  import { RouterStateUrl } from '../router.state.url';
  
 
  export interface State {
    routerReducer: fromRouter.RouterReducerState<RouterStateUrl>;
  }

  export const reducers: ActionReducerMap<State> = {
    routerReducer: fromRouter.routerReducer
  };
  
  // console.log all actions
  export function logger(reducer: ActionReducer<State>): ActionReducer<State> {
    return function(state: State, action: any): State {
      console.log('state', state);
      console.log('action', action);
  
      return reducer(state, action);
    };
  }

  export const metaReducers: MetaReducer<State>[] = !environment.production
    ? [logger]
    : [];
  
