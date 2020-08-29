import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../store';
import PhoneEnter from './PhoneEnter';
// import InnEnter from './InnEnter';
import { TextField, Button, CircularProgress, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { ModerationAPI } from '../../api/ModerationAPI';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { useHistory } from 'react-router-dom';
import { RegIcon, AuthIcon } from '../../icons/icons';
import { ClientAPI } from '../../api/ClientAPI';
import VideoCall from '../Registration/VideoCall';
import BusyOperators from '../Registration/BusyOperators';
import Solve from '../bricks/Solve';
import VideocamRoundedIcon from '@material-ui/icons/VideocamRounded';

type Props = ReturnType<typeof mapStateToProps>;

const Authorization: React.FC<Props> = ({ settings, solve }) => {
    let history = useHistory();
    const [start, setStart] = useState(false);
    const [title, setTitle] = useState('');
    const [guest, setGuest] = useState(false);
    const [userName, setUserName] = useState('');
    const [conferenceJoinLink, setConferenceJoinLink] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState({
        error: false,
        message: '',
    });
    const [requestId, setRequestId] = useState<number | null>(null);
    const [status, setStaus] = useState('');
    const [action, setAction] = useState('');

    const catchError = (message: string) => {
        setErrorMessage({error: true, message: message});
        setLoading(false);
    }

    const startVideoCallForGuest = () => {
        setLoading(true);
        ModerationAPI.startVideoCallForGuest(userName).then(data => {
            setRequestId(data.requestId);
            setErrorMessage({error: false, message: ''});
            setConferenceJoinLink(data.conferenceJoinLink);
        }).catch(({response}) => catchError(response.data.message));
    }

    // const getVideoCallStatus = () => {
    //     if(requestId) {
    //         ClientAPI.getVideoCallStatus('{0EBA066D-CF2A-44B7-9384-DDF677DFA210}', requestId).then(data => {
    //             setStaus(data.status);
    //             setLoading(false);
    //             if(data.status === 'responseTimeout') {
    //                 setRequestId(null);
    //             }
    //             if(data.status === 'conversationIsOver') {
    //                 window.location.reload(false);
    //                 setRequestId(null);
    //             }
    //             if(data.action === 'requestForGuestRegistration') {
    //                 setAction(data.action)
    //             }
    //             getVideoCallStatus();
    //         }).catch(({response}) => alert(response.data.message));
    //     }
    // }

    useEffect(() => {
        if(requestId) {
            if(window.location.pathname === '/') {
                const getVideoModerationStatusInterval = setInterval(() => {
                    ClientAPI.getVideoCallStatus('{0EBA066D-CF2A-44B7-9384-DDF677DFA210}', requestId).then(data => {
                        setStaus(data.status);
                        setLoading(false);
                        if(data.status === 'responseTimeout' && data.action !== 'registration_WaitModeration') {
                            setRequestId(null);
                            return () => clearInterval(getVideoModerationStatusInterval);
                        }
                        if(data.status === 'conversationIsOver' || (data.status === 'responseTimeout' && data.action === 'registration_WaitModeration')) {
                            window.location.reload(false);
                            setRequestId(null);
                            return () => clearInterval(getVideoModerationStatusInterval);
                        }
                        if(data.action) {
                            setAction(data.action)
                        }
                    }).catch(({response}) => alert(response.data.message));
                }, 1500);
                return () => clearInterval(getVideoModerationStatusInterval);
            }
        }
        // getVideoCallStatus();
    }, [requestId, setStaus, setLoading, setAction] );

    const authClick = (title: string) => {
        setStart(true);
        setTitle(title);
    }

    const authSelectView = () => {
        return (
            <div className="authSelect__content" style={settings ? {backgroundColor: settings.colorBox} : {}}>
                <div className="authorization__logo">{settings && <img src={settings.logo} alt={settings.name} />}</div>
                <div className="authSelect__item" 
                    onClick={() => authClick('Вход в систему')}
                    style={settings ? {backgroundColor: settings.color} : {}}>
                    <span className="authSelect__icon"><AuthIcon /></span>
                    <span className="authSelect__text" style={settings ? {color: settings.colorText} : {}}>Я клиент банка</span>
                </div>
                <div className="authSelect__item" 
                    onClick={() => authClick('Регистрация')}
                    style={settings ? {backgroundColor: settings.colorSecond} : {}}>
                    <span className="authSelect__icon"><RegIcon /></span>
                    <span className="authSelect__text">Хочу стать клиентом</span>
                </div>
                <div className="authSelect__item authSelect__border" 
                    onClick={() => setGuest(true)}
                    style={settings ? {borderColor: settings.color, color: settings.color} : {}}>
                    <span className="authSelect__icon"><VideocamRoundedIcon /></span>
                    <span className="authSelect__text" style={settings ? {color: settings.colorText} : {}}>Видео консультация <br /> со специалистом</span>
                </div>
            </div>
        )
    };

    const [isFocused, setIsFocused] = useState(false);

    const onFocus = (value: boolean) => {
        setIsFocused(value);
    }

    const onBlur = (value: boolean) => {
        setIsFocused(value);
    }

    const userNameView = () => {
        return (
            <div className="authSelect__content">
                <div className="authorization__logo">{settings && <img src={settings.logo} alt={settings.name} />}</div>
                <TextField 
                    error={errorMessage.error}
                    fullWidth 
                    label="Напишите ваше имя" 
                    value={userName} 
                    onChange={(event) => setUserName(event.target.value)} 
                    helperText={errorMessage.message} />
                <div className="btnRow">
                    <Button  fullWidth variant="contained" color="primary" disableElevation 
                        disabled={loading}
                        startIcon={
                            loading &&
                            <CircularProgress size={26} />
                        }
                        onClick={startVideoCallForGuest}>Войти</Button>
                </div>
            </div>
        )
    }

    const exitClick = () => {
        window.location.reload(false);
        return history.push('/');
    }

    if(status === 'waitingOperator' && action !== 'registration_WaitModeration') {
        return <VideoCall />
    }

    if(status === 'responseTimeout' && action !== 'registration_WaitModeration') {
        return <BusyOperators />
    }

    const openIframe = () => {
        if(!solve) {
            return <Solve />
        } else {
            return <iframe src={conferenceJoinLink} className="iframe__content" allow="camera;microphone" title="video call"></iframe>
        }
    }

    const guestRegistration = () => {
        if(action !== '' && requestId && action !== 'registration_WaitModeration') {
            return (
                <div className={`authorization ${isFocused ? 'isFocused' : 'isBlur'}`}>
                    <PhoneEnter onFocus={(value) => onFocus(value)} onBlur={(value) => onBlur(value)} guestReg={true} requestId={requestId} title="Регистрация" />
                </div> 
            )
        }
    }

    if((status === 'activeConversation' && conferenceJoinLink !== '') || (action === 'registration_WaitModeration')) {
        return (
            <>
                <div className="iframe">
                    {openIframe()}
                    <div className="exitGuest">
                        <div className="exitGuest__logo">{settings && <img src={settings.smallLogo} alt={settings.name} />}</div>
                        <ListItem button className="exitGuest__btn" onClick={exitClick}>
                            <ListItemText primary="Выход" />
                            <ListItemIcon>
                                <ExitToAppIcon />
                            </ListItemIcon>
                        </ListItem>
                    </div>
                </div>
                {guestRegistration()}
            </>
        )
    }

    return (
        <div className={`authorization ${isFocused ? 'isFocused' : 'isBlur'}`}>
            {start ? <PhoneEnter onFocus={(value) => onFocus(value)} onBlur={(value) => onBlur(value)} guestReg={false} title={title} /> : 
                <div className="content authSelect" style={settings ? {backgroundImage: `linear-gradient(${settings.gradientColor}`} : {}}>
                    {guest ? userNameView() : authSelectView()}
                    {!guest &&
                        <div className="langGroup">
                            <Button color="primary" className="active">Русский</Button>
                            <Button color="primary">Кыргызча</Button>
                        </div>
                    }
                </div>
            }
        </div>
    );
}

const mapStateToProps = (state: RootState) => ({
    settings: state.registration.settings,
    solve: state.registration.solve,
});

export default connect(mapStateToProps)(Authorization);