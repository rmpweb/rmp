import { Action } from '@ngrx/store';


export const LOAD = '[Images] Load';
export const LOAD_SUCCESS = '[Images] Load Success';
export const LOAD_FAIL = '[Images] Load Fail';
export const SELECT = '[Images] Select';
export const DESELECT = '[Images] Deselect';


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

export class SelectAction implements Action {
  readonly type = SELECT;

  constructor(public payload: string) {}
}

export class DeselectAction implements Action {
  readonly type = DESELECT;
}

export type Actions =
  | LoadAction
  | LoadSuccessAction
  | LoadFailAction
  | SelectAction
  | DeselectAction;