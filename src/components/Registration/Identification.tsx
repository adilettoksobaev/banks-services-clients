import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../store';
import { Button, CircularProgress } from '@material-ui/core';
import { CameraIcon } from '../../icons/icons';
import { RegistrationAPI } from '../../api/RegistrationAPI';
import SnackbarAlert from '../bricks/SnackbarAlert';
import CalncelDilalog from '../bricks/CalncelDilalog';
import VideoCall from './VideoCall';
import BusyOperators from './BusyOperators';
import Axios from 'axios';
import { InstanceHeadRegistration } from '../../api/InstanceHead';
import Solve from '../bricks/Solve';
import Congratulate from './Congratulate';
import NotPassChecked from './NotPassChecked';

type Props = ReturnType<typeof mapStateToProps>
const Identification: React.FC<Props> = ({ regSessionId, solve }) => {
    const [state, setState] = useState({
        availableRightNow: false,
        schedule: ""
    });
    const [videoConferenceUrl, setVideoConferenceUrl] = useState('');
    const [notification, setNotification] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState({
        error: false,
        message: '',
    });
    const [openCancel, setOpenCancel] = useState(false);
    const [requestId, setRequestId] = useState<number | null>(null);
    const [status, setStaus] = useState('');
    const [regStatus, setRegStatus] = useState('');

    const cencelClickOpen = () => {
        setOpenCancel(true);
    }

    const cencelClickClose = () => {
        setOpenCancel(false);
    }

    const catchError = (message: string) => {
        setErrorMessage({error: true, message: message});
        setLoading(false);
        setNotification(true);
    }

    useEffect(() => {
        const settingsUrl = `/companiesSettings/${window.location.hostname}/settings.json`;
        Axios.get(settingsUrl).then(res => {
            InstanceHeadRegistration.init(res.data.apiKey);
            if(regSessionId) {
                RegistrationAPI.getVideoModerationSchedule(regSessionId).then(data => {
                    setState({availableRightNow: data.result.availableRightNow, schedule: data.result.schedule});
                })
            }
        });
    }, [regSessionId]);

    const startVideoModerationClick = () => {
        setLoading(true);
        if(regSessionId) {
            RegistrationAPI.startVideoModeration(regSessionId).then(data => {
                if(data.status === 'fail') {
                    catchError(data.message);
                }
                if(data.status === 'success') {
                    setRequestId(data.result.requestId);
                    setLoading(false);
                    setNotification(false);
                    setVideoConferenceUrl(data.result.videoConferenceUrl);
                }
            }).catch(({response}) => catchError(response.data.message));
        }
    }

    useEffect(() => {
        if(regSessionId && requestId) {
            if(window.location.pathname === '/identification') {
                const getVideoModerationStatusInterval = setInterval(() => {
                    RegistrationAPI.getVideoModerationStatus(regSessionId, requestId).then(data => {
                        if(data.status === 'fail') {
                            catchError(data.message);
                        }
                        if(data.status === 'success') {
                            setStaus(data.result);
                            if(data.result === 'conversationIsOver' || data.result === 'responseTimeout') {
                                setRequestId(null);
                                return () => clearInterval(getVideoModerationStatusInterval);
                            }
                        }
                    }).catch(({response}) => catchError(response.data.message));
                    RegistrationAPI.getRegistrationStatus(regSessionId).then(data => {
                        if(data.status === "success") {
                            setRegStatus(data.result.status);
                            if(data.result.status === "Confirmed" || data.result.status === "Refused") {
                                setRequestId(null);
                                return () => clearInterval(getVideoModerationStatusInterval);
                            }
                        }
                    }).catch(({response}) => alert(response));
                }, 1500);
                return () => clearInterval(getVideoModerationStatusInterval);
            }
        }
    }, [regSessionId, requestId]);

    if(regStatus === "Confirmed") {
        return <Congratulate />
    }

    if(regStatus === "Refused") {
        return <NotPassChecked />
    }

    if(status === 'waitingOperator') {
        return <VideoCall />
    }

    if(status === 'responseTimeout') {
        return <BusyOperators />
    }

    if(status === 'activeConversation' && videoConferenceUrl !== '') {
        if(!solve) {
            return <Solve />
        } else {
            return <iframe src={videoConferenceUrl} className="iframeIdentification" allow="camera;microphone" title="video call"></iframe>
        }
    }

    return (
        <div className="content identification">
            <div className="content__head">
                <Button className="cancel" color="primary" onClick={cencelClickOpen} >Закрыть</Button>
                <span className="content__headTitle">Видеозвонок</span>
            </div>
            <div className="title">Для подтверждения вашей личности необходимо связаться с вами по видеосвязи</div>
            <div className="icon"><CameraIcon /></div>
            <div className="btnRow">
                <div className="identification__desc">{state.schedule}</div>
                <Button 
                    fullWidth 
                    variant="contained" 
                    color="primary" 
                    disableElevation
                    disabled={state.availableRightNow ? false : true}
                    startIcon={
                        loading &&
                        <CircularProgress color="secondary" size={26} />
                    }
                    onClick={startVideoModerationClick}>Видеозвонок сейчас</Button>
                    <Button 
                        fullWidth 
                        variant="contained" 
                        color="default" 
                        disableElevation>Позвонить позже</Button>
            </div>
            <SnackbarAlert 
                notification={notification}
                setNotification={setNotification} 
                message={errorMessage.message}
                severity="error" 
                vertical="top" 
                horizontal="center" />
            <CalncelDilalog 
                openCancel={openCancel}
                cencelClickClose={cencelClickClose} 
                backHistory="/" />
        </div>
    );
}

const mapStateToProps = (state: RootState) => ({
    regSessionId: state.registration.regSessionId,
    solve: state.registration.solve,
});

export default connect(mapStateToProps)(Identification);