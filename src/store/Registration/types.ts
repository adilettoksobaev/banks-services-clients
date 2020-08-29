export interface RegistrationState {
    sessionId: string | null;
    regSessionId: string | null;
    isAuthorized: boolean;
    confirmUser: IConfirmUser | null;
    tabValue: number;
    settings: ISettings | null;
    loading: boolean;
    solve: boolean;
    documentStatusSuccess: boolean,
    newsLongPolling: NewsLongPolling | null,
    contractListOpen: boolean;
}

export enum RegistrationActionsTypes {
    START_REGISTRATION = 'START_REGISTRATION',
    IS_AUTHORIZED = 'IS_AUTHORIZED',
    CONFIRM_USER = 'CONFIRM_USER',
    LOGOUT = 'LOGOUT',
    TAB_VALUE = 'TAB_VALUE',
    GET_SETTINGS = 'GET_SETTINGS',
    GET_SESSION_ID = 'GET_SESSION_ID',
    SET_LOADER = 'SET_LOADER',
    REG_LOGOUT = 'REG_LOGOUT',
    SET_SOLVE = 'SET_SOLVE',
    DOCUMENT_STATUS_SUCCESS = 'DOCUMENT_STATUS_SUCCESS',
    NEWS_LONG_POLLING = 'NEWS_LONG_POLLING',
    CONTRACT_LIST_OPEN = 'CONTRACT_LIST_OPEN',
}

export interface NewsLongPolling {
    newsType: NewsType,
    message: string
}

export enum NewsType {
    none = "none", 
    needPhotoForVerificationUser = "needPhotoForVerificationUser", 
    pushMessage = "pushMessage", 
    authorizationConfirmed = "authorizationConfirmed", 
    checkSignDocument = "checkSignDocument", 
    sessionClosed = "sessionClosed", 
    refreshChildSessions = "refreshChildSessions", 
    addNewDocument = "addNewDocument",
}

export interface IConfirmUser {
    dateBirth: string,
    dateExpiry: string,
    dateIssue: string,
    authority: string,
    inn: string,
    passportNumber: string,
    name: string,
    surname: string,
    patronymic: string,
    userDidNotChangeData: boolean,
    registrationAddress: string,
}

export interface ISettings {
    apiKey: string
    color: string
    colorSecond: string
    logo: string
    smallLogo: string
    name: string
    gradientColor: string
    colorBox: string,
    colorText: string,
}
  