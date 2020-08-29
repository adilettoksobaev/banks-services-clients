import React, { Dispatch, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RootState, actions } from '../../store';
import { ThunkDispatch } from 'redux-thunk';
import { Action, AnyAction } from 'redux';
import { Switch, Route } from 'react-router-dom';
import Authorization from '../Authorization/Authorization';
import StepIndividual from '../Registration/StepIndividual';
import PhotoFace from '../Registration/PhotoFace';
import PasswordFace from '../Registration/PasswordFace';
import PasswordBack from '../Registration/PasswordBack';
import PasswordData from '../Registration/PasswordData';
import PersonalNumber from '../Registration/PersonalNumber';
import RegistrationEnd from '../Registration/RegistrationEnd';
import Identification from '../Registration/Identification';
import { SessionAPI, IUserInfo } from '../../api/SessionAPI';
import MobileMenu from '../MobileMenu/MobileMenu';
import ClientPage from '../Client/ClientPage';
import Axios from 'axios';
import { InstanceHead, InstanceHeadRegistration } from '../../api/InstanceHead';
import { ISettings, NewsLongPolling, NewsType } from '../../store/Registration/types';
import Spinner from '../Spinner/Spinner';  
import useMediaQuery from '@material-ui/core/useMediaQuery';
import DesctopView from '../DesctopView/DesctopView';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';
import { ClientDocumentsAPI, IContract } from '../../api/ClientDocumentsAPI';
import ContractInfo from '../bricks/ContractInfo';
import { GetNews } from '../../utils/getNews';
import { RegistrationAPI } from '../../api/RegistrationAPI';
import { localStorageGetItem } from '../../utils/storage';
// import ClientVideoCall from '../Client/ClientVideoCall';
// import Profile from '../Profile/Profile';
// import SecretWord from '../Registration/SecretWord';
// import VideoCall from '../Registration/VideoCall';
// import Congratulate from '../Registration/Congratulate';
// import DataChecked from '../Registration/DataChecked';
// import NotPassChecked from '../Registration/NotPassChecked';
// import MobileMenu from '../MobileMenu/MobileMenu';
// import Documents from '../Client/Documents';
// import PaymentOrder from '../Client/PaymentOrder';

type Props = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>;

const AppStack:React.FC<Props> = (props) => {
    const { isAuthorized, isAuthorizedAction, settingsAction, sessionId, setLoaderAction, loading, logoutAction, regLogoutAction, 
            newsLongPollingAction, newsLongPolling } = props;
    const { pathname } = window.location;
    const matches = useMediaQuery('(min-width:600px)');
    const [pulingOpen, setPulingOpen] = useState(false);
    const [settingsLoaded, setSettingsLoaded] = useState(false);
    const [userInfo, setUserInfo] = useState<IUserInfo>({
        inn: "",
        fullName: "",
        userId: 0,
    });
    const [currentContract, setCurrentContract] = useState<IContract | null>(null);

    useEffect(() => {
        const settingsUrl = `/companiesSettings/${window.location.hostname}/settings.json`;
        console.log('settingsUrl:', settingsUrl);
        const catchError = (response: any) => {
            if(response.status === 401) {
                logoutAction();
            }
            if(response.status === 400) {
                alert(response.message);
            }
            setLoaderAction(false);
        }
        const catchErrorReg = (response: any) => {
            if(response.status === 401) {
                regLogoutAction();
            }
            if(response.status === 400) {
                regLogoutAction();
            }
            setLoaderAction(false);
        }
        Axios.get(settingsUrl).then(res => {
            settingsAction(res.data);
            InstanceHead.init(res.data.apiKey);
            InstanceHeadRegistration.init(res.data.apiKey);
            if(sessionId) {
                setLoaderAction(true);
                GetNews.subscribe();
                SessionAPI.getUserInfo(sessionId).then(data => {
                    setUserInfo({inn: data.inn, fullName: data.fullName, userId: data.userId});
                })
                SessionAPI.checkSession(sessionId).then(res => {
                    if(res.status === 200) {
                        isAuthorizedAction(true);
                    } else {
                        isAuthorizedAction(false);
                    }
                    setLoaderAction(false);
                }).catch(({response}) => catchError(response));
            }
            const regSessionId = localStorageGetItem('regSessionId');
            if(regSessionId) {
                setLoaderAction(true);
                RegistrationAPI.getRegistrationStatus(regSessionId).then(data => {
                    if(data.status === "success") {
                        isAuthorizedAction(true);
                    }
                    setLoaderAction(false);
                }).catch(({response}) => catchErrorReg(response));
            }
            setSettingsLoaded(true);
        });
    }, [settingsAction, sessionId, isAuthorizedAction, setLoaderAction, logoutAction, regLogoutAction, newsLongPollingAction]);

    useEffect(() => {
        if(newsLongPolling) {
            if(newsLongPolling.newsType === NewsType.addNewDocument) {
                setPulingOpen(true);
            }
        }
    }, [newsLongPolling]);

    const pulingOpenClick = () => {
        if(sessionId) {
            ClientDocumentsAPI.getContracts(sessionId, userInfo.userId).then(data => {
                const newDocument = data.find((doc: IContract) => doc.documentStatus === "New");
                setCurrentContract(newDocument);
                setPulingOpen(false);
            }).catch(({response}) => alert(response));
        }
    }

    // const userAgent = navigator.userAgent.toLowerCase();
    // if(!/chrome/.test(userAgent) || !/safari/.test(userAgent)) {
    //     return <Forbid />
    // }

    if(matches) {
        return <DesctopView />
    }

    if(loading || !settingsLoaded) {
        return <Spinner />
    }

    if(!isAuthorized) {
        return <Authorization />
    }

    return (
        <div className="container">
            {(pathname.match(/client/)) &&
                <>
                    <MobileMenu /> 
                    <Dialog
                        open={pulingOpen}
                        className="modal confirm">
                        <DialogTitle>Уважаемый клиент</DialogTitle>
                        <DialogContent>
                            <p className="modal__text">Пожалуйста ознакомьтесь с документом</p>
                        </DialogContent>
                        <DialogActions className="modal__actions">
                            <Button onClick={() => setPulingOpen(false)} color="primary">Отмена</Button>
                            <Button onClick={pulingOpenClick} variant="contained" color="primary" disableElevation>Открыть</Button>
                        </DialogActions>
                    </Dialog>
                </>
            }
            {currentContract && 
                <ContractInfo contract={currentContract} userInfo={userInfo} setCurrentContract={setCurrentContract} />
            }
            <Switch>
                <Route 
                    path="/" 
                    component={Authorization} 
                    exact />
                <Route 
                    path="/stepIndividual" 
                    component={StepIndividual} />
                <Route 
                    path="/photo-face" 
                    component={PhotoFace} />
                <Route 
                    path="/password-face" 
                    component={PasswordFace} />
                <Route 
                    path="/password-back" 
                    component={PasswordBack} />
                <Route 
                    path="/password-data" 
                    component={PasswordData} />
                <Route 
                    path="/personal-number" 
                    component={PersonalNumber} />
                <Route 
                    path="/registration" 
                    component={RegistrationEnd} />
                <Route 
                    path="/identification" 
                    component={Identification} />
                <Route 
                    path="/client" 
                    component={ClientPage} />
            </Switch>
        </div>
    );
}

const mapStateToProps = (state: RootState) => ({
    isAuthorized: state.registration.isAuthorized,
    sessionId: state.registration.sessionId,
    regSessionId: state.registration.regSessionId,
    loading: state.registration.loading,
    newsLongPolling: state.registration.newsLongPolling,
});

const mapDispatchToProps = (dispatch: Dispatch<Action> & ThunkDispatch<any, any, AnyAction>) => ({
    isAuthorizedAction: (isAuthorized: boolean) => dispatch(actions.registration.isAuthorizedAction(isAuthorized)),
    settingsAction: (settings: ISettings) => dispatch(actions.registration.settingsAction(settings)),
    setLoaderAction: (loading: boolean) => dispatch(actions.registration.setLoaderAction(loading)),
    logoutAction: () => dispatch(actions.registration.logoutAction()),
    regLogoutAction: () => dispatch(actions.registration.regLogoutAction()),
    newsLongPollingAction: (newsLongPolling: NewsLongPolling) => dispatch(actions.registration.newsLongPollingAction(newsLongPolling)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AppStack);