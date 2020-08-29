import { ActionCreator, Action } from 'redux';
import { RegistrationActionsTypes, IConfirmUser, ISettings, NewsLongPolling } from './types';

export interface ISessionId extends Action<RegistrationActionsTypes.GET_SESSION_ID> {
    sessionId: string;
}
export interface IStartRegistration extends Action<RegistrationActionsTypes.START_REGISTRATION> {
    regSessionId: string;
}
export interface IIsAuthorized extends Action<RegistrationActionsTypes.IS_AUTHORIZED> {
    isAuthorized: boolean;
}

export interface IConfirmUserAction extends Action<RegistrationActionsTypes.CONFIRM_USER> {
    confirmUser: IConfirmUser;
}

export interface ILogout extends Action<RegistrationActionsTypes.LOGOUT>{}
export interface IRegLogout extends Action<RegistrationActionsTypes.REG_LOGOUT>{}

export interface ITabValue extends Action<RegistrationActionsTypes.TAB_VALUE> {
    tabValue: number;
}
export interface ISettingsAction extends Action<RegistrationActionsTypes.GET_SETTINGS> {
    settings: ISettings;
}

export interface ISetLoader extends Action<RegistrationActionsTypes.SET_LOADER>{
    loading: boolean
}
export interface IDocumentStatusSuccess extends Action<RegistrationActionsTypes.DOCUMENT_STATUS_SUCCESS>{
    documentStatusSuccess: boolean
}

export interface ISolve extends Action<RegistrationActionsTypes.SET_SOLVE>{
    solve: boolean
}

export interface INewsLongPolling extends Action<RegistrationActionsTypes.NEWS_LONG_POLLING>{
    newsLongPolling: NewsLongPolling
}

export interface IContractListOpen extends Action<RegistrationActionsTypes.CONTRACT_LIST_OPEN>{
    contractListOpen: boolean
}

export type RegistrationActions =
    | IStartRegistration
    | IIsAuthorized
    | IConfirmUserAction
    | ILogout
    | ITabValue
    | ISettingsAction
    | ISessionId
    | ISetLoader
    | IRegLogout
    | ISolve
    | IDocumentStatusSuccess
    | INewsLongPolling
    | IContractListOpen;

export const contractListOpenAction: ActionCreator<IContractListOpen> = (contractListOpen: boolean) => {
    return {
        type: RegistrationActionsTypes.CONTRACT_LIST_OPEN,
        contractListOpen
    }
}

export const newsLongPollingAction: ActionCreator<INewsLongPolling> = (newsLongPolling: NewsLongPolling) => {
    return {
        type: RegistrationActionsTypes.NEWS_LONG_POLLING,
        newsLongPolling
    }
}

export const documentStatusSuccessAction: ActionCreator<IDocumentStatusSuccess> = (documentStatusSuccess: boolean) => {
    return {
        type: RegistrationActionsTypes.DOCUMENT_STATUS_SUCCESS,
        documentStatusSuccess
    }
}

export const sessionIdAction: ActionCreator<ISessionId> = (sessionId: string) => {
    return {
        type: RegistrationActionsTypes.GET_SESSION_ID,
        sessionId
    }
}

export const startRegistrationAction: ActionCreator<IStartRegistration> = (regSessionId: string) => {
    return {
        type: RegistrationActionsTypes.START_REGISTRATION,
        regSessionId
    }
}

export const isAuthorizedAction: ActionCreator<IIsAuthorized> = (isAuthorized: boolean) => {
    return {
        type: RegistrationActionsTypes.IS_AUTHORIZED,
        isAuthorized
    }
}

export const confirmUserAction: ActionCreator<IConfirmUserAction> = (confirmUser: IConfirmUser) => {
    return {
        type: RegistrationActionsTypes.CONFIRM_USER,
        confirmUser
    }
}

export const logoutAction: ActionCreator<ILogout> = () => {
    return {
        type: RegistrationActionsTypes.LOGOUT
    }
}

export const regLogoutAction: ActionCreator<IRegLogout> = () => {
    return {
        type: RegistrationActionsTypes.REG_LOGOUT
    }
}

export const tabValueAction: ActionCreator<ITabValue> = (tabValue: number) => {
    return {
        type: RegistrationActionsTypes.TAB_VALUE,
        tabValue
    }
}

export const settingsAction: ActionCreator<ISettingsAction> = (settings: ISettings) => {
    return {
        type: RegistrationActionsTypes.GET_SETTINGS,
        settings
    }
}

export const setLoaderAction: ActionCreator<ISetLoader> = (loading: boolean) => {
    return {
        type: RegistrationActionsTypes.SET_LOADER,
        loading
    }
}
export const solveAction: ActionCreator<ISolve> = (solve: boolean) => {
    return {
        type: RegistrationActionsTypes.SET_SOLVE,
        solve
    }
}