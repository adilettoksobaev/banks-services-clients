import { StateType } from 'typesafe-actions';
import rootReducer from './root-reducer';


import * as RegistrationActions from './Registration/actions';

export { default } from './store';
export { default as rootReducer } from './root-reducer';

export const actions = {
    registration: RegistrationActions,
}

export type RootState = StateType<typeof rootReducer>;
