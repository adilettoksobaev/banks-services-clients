import React, { Dispatch, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../store';
import { ThunkDispatch } from 'redux-thunk';
import { Action, AnyAction } from 'redux';
import { Button, TextField, FormControl, InputLabel, Input, InputAdornment, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import { QuestionIcon } from '../../icons/icons';
import { useHistory } from 'react-router-dom';
import { IConfirmUser } from '../../store/Registration/types';
import CalncelDilalog from '../bricks/CalncelDilalog';
import { RegistrationAPI } from '../../api/RegistrationAPI';
import SnackbarAlert from '../bricks/SnackbarAlert';
import InputMask from 'react-input-mask';
import RegistrationEnd from './RegistrationEnd';

type Props = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps> & {
    guestPasswordData: boolean;
}

const PasswordData:React.FC<Props> = (props) => {
    const { regSessionId, guestPasswordData } = props;
    let history = useHistory();
    const [confirm, setConfirm] = useState(false);
    const [confirmUser, setConfirmUser] = useState({
        dateBirth: "",
        dateExpiry: "",
        dateIssue: "",
        authority: "",
        inn: "",
        passportNumber: "",
        name: "",
        surname: "",
        patronymic: "",
        userDidNotChangeData: true,
        registrationAddress: "",
    });
    const [openCancel, setOpenCancel] = useState(false);
    const [notification, setNotification] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState({
        error: false,
        message: '',
    });
    const [guestRegistrationEnd, setGuestRegistrationEnd] = useState(false);

    useEffect(() => {
        if(regSessionId) {
            RegistrationAPI.getUserRegistrationInfo(regSessionId).then(data => {
                if(data.status === "success") {
                    setConfirmUser(data.result);
                }
            }).catch(({response}) => catchError(response.data.message));
        }
    }, [regSessionId, setConfirmUser])

    const catchError = (message: string) => {
        setErrorMessage({error: true, message: message});
        setLoading(false);
        setNotification(true);
        setConfirm(false);
    }

    const cencelClickOpen = () => {
        setOpenCancel(true);
    }

    const cencelClickClose = () => {
        setOpenCancel(false);
    }

    const confirmUserChange = (prop: keyof IConfirmUser) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmUser({ ...confirmUser, [prop]: event.target.value });
    };

    const confirmUserClick = () => {
        setConfirm(true);
    }

    const confirmClose = () => {
        setConfirm(false);
    };

    const confirmUserRegistration = () => {
        setLoading(true);
        if(regSessionId) {
            RegistrationAPI.confirmUserRegistrationInfo(regSessionId, confirmUser).then(data => {
                if(data.status === 'success') {
                    setLoading(false);
                    setNotification(false);
                    if(guestPasswordData) {
                        setGuestRegistrationEnd(true);
                    } else {
                        return history.push('/registration');
                    }
                } else {
                    catchError(data.message);
                }
            }).catch(({response}) => catchError(response.data.message));
        }
    }

    return (
        <>
        {!guestRegistrationEnd ?
        <div className="content passwordData">
            <Button className="cancel" color="primary" onClick={cencelClickOpen}>Отменить</Button>
            <div className="title">Данные должны совпадать с паспортом</div>
            <div className="passwordData__form">
                <FormControl fullWidth>
                    <InputLabel>Персональный номер</InputLabel>
                    <Input
                        inputProps={{
                            maxLength: 14,
                        }}
                        value={confirmUser.inn}
                        onChange={confirmUserChange('inn')}
                        endAdornment={
                            <InputAdornment position="end">
                                <div onClick={() => history.push('/personal-number')}>
                                    <QuestionIcon />
                                </div>
                            </InputAdornment>
                        }
                    />
                </FormControl>
                <TextField 
                    fullWidth
                    label="Номер паспорта" 
                    value={confirmUser.passportNumber} 
                    onChange={confirmUserChange('passportNumber')} />
                <TextField 
                    fullWidth
                    label="Фамилия" 
                    value={confirmUser.surname} 
                    onChange={confirmUserChange('surname')} />
                <TextField 
                    fullWidth
                    label="Имя" 
                    value={confirmUser.name} 
                    onChange={confirmUserChange('name')}/>
                <TextField 
                    fullWidth
                    label="Отчество" 
                    value={confirmUser.patronymic} 
                    onChange={confirmUserChange('patronymic')} />
                <InputMask 
                    mask="99.99.9999" 
                    value={confirmUser.dateBirth} 
                    onChange={confirmUserChange('dateBirth')}>
                    {(inputProps: any) => 
                    <TextField 
                        {...inputProps} 
                        label="Дата рождения" 
                        fullWidth />}
                </InputMask>
                <InputMask 
                    mask="99.99.9999" 
                    value={confirmUser.dateIssue} 
                    onChange={confirmUserChange('dateIssue')}>
                    {(inputProps: any) => 
                    <TextField 
                        {...inputProps} 
                        label="Дата выдачи паспорта" 
                        fullWidth />}
                </InputMask>
                <TextField 
                    fullWidth
                    label="Орган, выдавший паспорт" 
                    value={confirmUser.authority} 
                    onChange={confirmUserChange('authority')} />
                <InputMask 
                    mask="99.99.9999" 
                    value={confirmUser.dateExpiry} 
                    onChange={confirmUserChange('dateExpiry')}>
                    {(inputProps: any) => 
                    <TextField 
                        {...inputProps} 
                        label="Дата окончания срока действия" 
                        fullWidth />}
                </InputMask>
                <TextField 
                    fullWidth
                    label="Адрес проживания"
                    value={confirmUser.registrationAddress} 
                    onChange={confirmUserChange('registrationAddress')} />
            </div>
            <div className="btnRow">
                <Button 
                    fullWidth 
                    variant="contained" 
                    color="primary" 
                    disableElevation
                    disabled={loading}
                    startIcon={
                        loading &&
                        <CircularProgress size={26} />
                    }
                    onClick={confirmUserClick}>Подтвердить</Button>
            </div>
            <CalncelDilalog 
                openCancel={openCancel}
                cencelClickClose={cencelClickClose} 
                backHistory="/stepIndividual" />
            <SnackbarAlert 
                notification={notification}
                setNotification={setNotification} 
                message={errorMessage.message}
                severity="error" 
                vertical="top" 
                horizontal="center" />
            <Dialog
                open={confirm}>
                <DialogTitle id="alert-dialog-title">Внимание!</DialogTitle>
                <DialogContent>
                    Вы подтверждаете верность данных?
                </DialogContent>
                <DialogActions>
                    <Button onClick={confirmClose} color="primary">Нет</Button>
                    <Button onClick={confirmUserRegistration} color="primary" autoFocus>Да</Button>
                </DialogActions>
            </Dialog>
        </div>
        : <RegistrationEnd guestRegistrationEnd={guestRegistrationEnd} />}
        </>
    );
}

const mapStateToProps = (state: RootState) => ({
    regSessionId: state.registration.regSessionId,
    confirmUser: state.registration.confirmUser,
});

const mapDispatchToProps = (dispatch: Dispatch<Action> & ThunkDispatch<any, any, AnyAction>) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(PasswordData);