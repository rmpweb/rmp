import { Action } from '@ngrx/store';


export const LOAD = '[Images] Load';
export const LOAD_SUCCESS = '[Images] Load Success';
export const LOAD_FAIL = '[Images] Load Fail';
export const SET_TAG_FILTER = '[Images] Set Tag Filter';
export const RESET_TAG_FILTER = '[Images] Reset Tag Filter';

export class LoadAction implements Action {
  readonly type = LOAD;
}

export class LoadSuccessAction implements Action {
  readonly type = LOAD_SUCCESS;

  constructor(public payload: any[]) {}
}

export class LoadFailAction implements Action {
  readonly type = LOAD_FAIL;

  constructor(public payload: any) {}
}

export class SetTagFilterAction implements Action {
  readonly type = SET_TAG_FILTER;
  constructor(public payload: string) {}
}

export class ResetTagFilterAction implements Action {
  readonly type = RESET_TAG_FILTER;
}

export type Actions =
  | LoadAction
  | LoadSuccessAction
  | LoadFailAction
  | SetTagFilterAction
  | ResetTagFilterAction;