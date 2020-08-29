import { combineReducers } from 'redux';
import registration from './Registration/reducer';

const rootReducer = combineReducers({
    registration,
});


export default rootReducer;