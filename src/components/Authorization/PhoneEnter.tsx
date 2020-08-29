import React, { Dispatch, useState } from 'react';
import { connect } from 'react-redux';
import { RootState, actions } from '../../store';
import { ThunkDispatch } from 'redux-thunk';
import { Action, AnyAction } from 'redux';
import { Button, FormControl, Input, InputAdornment, IconButton, FormHelperText, Dialog, DialogContent, DialogActions, TextField } from '@material-ui/core';
import { NavLink, useHistory } from 'react-router-dom';
import { ClearIcon } from '../../icons/icons';
import ArrowBackIosRoundedIcon from '@material-ui/icons/ArrowBackIosRounded';
import { RegistrationAPI } from '../../api/RegistrationAPI';
import { AuthAPI } from '../../api/AuthAPI';
import InputMask from 'react-input-mask';
import StepIndividual from '../Registration/StepIndividual';
import Axios from 'axios';
import { baseUrlRegistration } from '../../utils/baseUrl';

type Props = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps> & {
    onFocus: (value: any) => void;
    onBlur: (value: any) => void;
    guestReg: boolean;
    requestId?: number;
    title: string;
}

const PhoneEnter: React.FC<Props> = (props) => {
    let history = useHistory();
    const initialError = {
        error: false,
        message: '',
    }
    const { startRegistrationAction, sessionIdAction, isAuthorizedAction, onFocus, onBlur, settings, guestReg, requestId, title } = props;
    const [confirm, setConfirm] = useState(false);
    const [phone, setPhone] = useState('996');
    const [pinCode, setPinCode] = useState('');
    const [errorPhone, setErrorPhone] = useState(initialError);
    const [errorPinCode, setErrorPinCode] = useState(initialError);
    const [regConfirm, setRegConfirm] = useState(false);
    const [userFound, setUserFound] = useState(false);
    const [sessionIdReg, setSessionIdReg] = useState<string | null>(null);
    const newPhone = phone.replace(/[^0-9]/gim,'');
    const [guestRegOpen, setRegGuestOpen] = useState(false);

    const confirmClose = () => {
        setRegConfirm(false);
    };

    const phoneClick = () => {
        AuthAPI.authByPhone(newPhone).then(data => {
            if(data.result === 'userFound') {
                setErrorPhone({error: false, message: ''});
                setConfirm(true);
                setUserFound(true);
            }
            if(data.result === 'userNotFound') {
                setRegConfirm(true);
            }
        }).catch(({response}) => setErrorPhone({error: true, message: response.data.message}));
    }

    const registrationClick = () => {
        if(guestReg) {
            if(settings && requestId) {
                const headers = {
                    "Access-Control-Allow-Origin": "*",
                    "apiKey" : settings.apiKey,
                    "deviceId": "Desktop",
                    "requestId": requestId,
                }
                Axios.post(`${baseUrlRegistration()}api/Registration/StartRegistration/${newPhone}`, {}, {
                    headers: headers
                }).then(res => {
                    if(res.data.status === 'fail') {
                        setErrorPhone({error: true, message: res.data.message});
                    }
                    if(res.data.status === 'success') {
                        if(res.data.result.phoneAlreadyRegistered === true) {
                            setErrorPhone({error: true, message: res.data.result.message}); 
                            return;
                        }
                        setSessionIdReg(res.data.result.sessionId)
                        setErrorPhone({error: false, message: ''});
                        setConfirm(true);
                    }
                }).catch(({response}) => setErrorPhone({error: true, message: response.data.message}));
            }
        } else {
            RegistrationAPI.startRegistration(newPhone).then(data => {
                if(data.status === 'fail') {
                    setErrorPhone({error: true, message: data.message});
                }
                if(data.status === 'success') {
                    if(data.result.phoneAlreadyRegistered === true) {
                        setErrorPhone({error: true, message: data.result.message}); 
                        return;
                    }
                    setSessionIdReg(data.result.sessionId)
                    setErrorPhone({error: false, message: ''});
                    setConfirm(true);
                }
            }).catch(({response}) => setErrorPhone({error: true, message: response.data.message}));
        }
        setRegConfirm(false);
    }

    const pinCodeClick = () => {
        if(userFound) {
            AuthAPI.phonePinConfirm(pinCode, newPhone).then(data => {
                if(data.approve) {
                    sessionIdAction(data.sessionId);
                    isAuthorizedAction(true);
                    setErrorPinCode({error: false, message: ''});
                    return history.push('/client');
                } else {
                    setErrorPinCode({error: true, message: 'Введите правильный pinCode'});
                }
            }).catch(({response}) => setErrorPhone({error: true, message: response.data.message}));
        } else {
            if(sessionIdReg) {
                RegistrationAPI.checkSmsCode(sessionIdReg, pinCode).then(data => {
                    if(data.status === 'fail') {
                        setErrorPinCode({error: true, message: data.message});
                    }
                    if(data.status === 'success') {
                        startRegistrationAction(sessionIdReg);
                        setErrorPinCode({error: false, message: ''});
                        if(guestReg) {
                            setRegGuestOpen(true);
                        } else {
                            isAuthorizedAction(true);
                            return history.push('/stepIndividual');
                        }
                    }
                }).catch(({response}) => setErrorPinCode({error: true, message: response.data.message}));
            }
        }
    }

    const phoneView = () => {
        return (
            <div className="authorization__form">
                <InputMask 
                    mask="+999 999-99-99-99" 
                    value={phone} 
                    onChange={(event) => setPhone(event.target.value)}  
                    onFocus={() => onFocus(true)} 
                    onBlur={() => onBlur(false)}>
                    {(inputProps: any) => 
                    <TextField 
                        {...inputProps} 
                        label="Введите номер телефона" 
                        fullWidth 
                        error={errorPhone.error} 
                        helperText={errorPhone.message} />}
                </InputMask>
                {/* <NavLink className="authorization__link" to="#">У меня поменялся номер телефона</NavLink>
                <NavLink className="authorization__link" to="#">Вход для юридических лиц</NavLink> */}
                <div className="btnRow">
                    <Button onClick={phoneClick} fullWidth variant="contained" color="primary" disableElevation>Далее</Button>
                </div>
            </div>
        )
    }

    const pinCodeView = () => {
        return (
            <div className="authorization__form">
                <FormControl fullWidth className="authorization__pinInput" error={errorPinCode.error}>
                    <Input
                        inputProps={{
                            maxLength: 4,
                            autocomplete:"off"
                        }}
                        type="password"
                        placeholder="****"
                        value={pinCode}
                        onChange={(event) => setPinCode(event.target.value)}
                        startAdornment={
                            <InputAdornment position="start">
                                <span className="authorization__code">Код</span>
                            </InputAdornment>
                        }
                        endAdornment={
                            <InputAdornment position="end" className="authorization__clear">
                                <IconButton onClick={() => setPinCode('')}>
                                    <ClearIcon />
                                </IconButton>
                            </InputAdornment>
                        }
                        onFocus={() => onFocus(true)} 
                        onBlur={() => onBlur(false)}
                    />
                    <FormHelperText>{errorPinCode.message}</FormHelperText>
                </FormControl>
                <NavLink className="authorization__link" to="#">Получить код еще раз</NavLink>
                <div className="btnRow">
                    <Button 
                        onClick={pinCodeClick} 
                        fullWidth variant="contained" color="primary" 
                        disableElevation
                        disabled={pinCode.length === 4 ? false : true}>Далее</Button>
                </div>
            </div>
        )
    }

    return (
        <>
            {!guestRegOpen ?
                <>
                    <div onClick={() =>  window.location.reload()} className="back"><ArrowBackIosRoundedIcon />Назад</div>
                    <div className="title">{!confirm ? title : 'Введите код из смс'}</div>
                    <div className="authorization__logo">{settings && <img src={settings.logo} alt={settings.name} />}</div>
                    {!confirm ? phoneView() : pinCodeView()}
                </>
                : <StepIndividual guestReg={guestReg} />
            }
            <Dialog
                open={regConfirm}>
                <DialogContent>
                    <strong className="center">Номер {phone} не зарегистрирован</strong>
                </DialogContent>
                <DialogActions>
                    <div className="justify-space-around">
                        <Button onClick={confirmClose} color="primary">Отмена</Button>
                        <Button onClick={registrationClick} color="primary" autoFocus>Регистрация</Button>
                    </div>
                </DialogActions>
            </Dialog>
        </>
    );
}

const mapStateToProps = (state: RootState) => ({
    settings: state.registration.settings,
});

const mapDispatchToProps = (dispatch: Dispatch<Action> & ThunkDispatch<any, any, AnyAction>) => ({
    startRegistrationAction: (regSessionId: string) => dispatch(actions.registration.startRegistrationAction(regSessionId)),
    sessionIdAction: (sessionId: string) => dispatch(actions.registration.sessionIdAction(sessionId)),
    isAuthorizedAction: (isAuthorized: boolean) => dispatch(actions.registration.isAuthorizedAction(isAuthorized))
});

export default connect(mapStateToProps, mapDispatchToProps)(PhoneEnter);