import { Reducer } from "redux";
import { RegistrationState } from "./types";
import { RegistrationActions } from "./actions";
import { RegistrationActionsTypes } from "./types";
import { localStorageGetItem, localStorageSetItem, localStorageRemoveItem } from "../../utils/storage";

const defaultState: RegistrationState = {
    sessionId: localStorageGetItem('sessionId'),
    regSessionId: localStorageGetItem('regSessionId'),
    isAuthorized: false,
    confirmUser: JSON.parse(sessionStorage.getItem("confirmUser")  || '{}'),
    tabValue: 0,
    settings: JSON.parse(sessionStorage.getItem("settings")  || '{}'),
    loading: false,
    solve: false,
    documentStatusSuccess: false,
    newsLongPolling: null,
    contractListOpen: false,
};

export const authReducer: Reducer<RegistrationState, RegistrationActions> = (state = defaultState, action) => {

    switch (action.type) {
        case RegistrationActionsTypes.CONTRACT_LIST_OPEN:
            return {
                ...state,
                contractListOpen: action.contractListOpen
            };
        case RegistrationActionsTypes.NEWS_LONG_POLLING:
            return {
                ...state,
                newsLongPolling: action.newsLongPolling
            };
        case RegistrationActionsTypes.DOCUMENT_STATUS_SUCCESS:
            return {
                ...state,
                documentStatusSuccess: action.documentStatusSuccess
            };
        case RegistrationActionsTypes.SET_SOLVE:
            return {
                ...state,
                solve: action.solve
            };
        case RegistrationActionsTypes.SET_LOADER:
            return {
                ...state,
                loading: action.loading
            };
        case RegistrationActionsTypes.GET_SESSION_ID:
            localStorageSetItem('sessionId', action.sessionId);
            return {
                ...state,
                sessionId: action.sessionId,
            };
        case RegistrationActionsTypes.START_REGISTRATION:
            localStorageSetItem('regSessionId', action.regSessionId);
            return {
                ...state,
                regSessionId: action.regSessionId,
            };
        case RegistrationActionsTypes.IS_AUTHORIZED:
            return {
                ...state,
                isAuthorized: action.isAuthorized,
            };
        case RegistrationActionsTypes.CONFIRM_USER:
            sessionStorage.setItem("confirmUser", JSON.stringify(action.confirmUser));
            return {
                ...state,
                confirmUser: action.confirmUser,
            };
        case RegistrationActionsTypes.LOGOUT:
            localStorageRemoveItem('sessionId');
            return {
                ...state,
                sessionId: null,
                isAuthorized: false,
            };
        case RegistrationActionsTypes.REG_LOGOUT:
            localStorageRemoveItem('regSessionId');
            return {
                ...state,
                regSessionId: null,
                isAuthorized: false,
            };
        case RegistrationActionsTypes.TAB_VALUE:
            return {
                ...state,
                tabValue: action.tabValue
            };
        case RegistrationActionsTypes.GET_SETTINGS:
            sessionStorage.setItem("settings", JSON.stringify(action.settings));
            return {
                ...state,
                settings: action.settings
            };
        default:
            return state;
    }
};

export default authReducer;