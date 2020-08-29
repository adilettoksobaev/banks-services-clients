import React, { Dispatch, useState } from 'react';
import { connect } from 'react-redux';
import { RootState, actions } from '../../store';
import { ThunkDispatch } from 'redux-thunk';
import { Action, AnyAction } from 'redux';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';
import { ClientDocumentsAPI, DocumentStatus } from '../../api/ClientDocumentsAPI';
import SnackbarAlert from './SnackbarAlert';

type Props = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps> & {
    openConfirm: boolean;
    confirmClickClose: () => void;
    text: string;
    buttonText: string;
    cinfirm: boolean;
    title: string;
    documentId: string;
    setDocumentStatus: React.Dispatch<React.SetStateAction<DocumentStatus>>;
    setGoBack?: React.Dispatch<React.SetStateAction<boolean>>;
}

const ConfirmModal:React.FC<Props> = (props) => {
    const { sessionId, openConfirm, confirmClickClose, text, buttonText, cinfirm, title, documentId, documentStatusSuccessAction,
            documentStatusSuccess, setDocumentStatus, setGoBack } = props;
    const [notification, setNotification] = useState(false);
    const [errorMessage, setErrorMessage] = useState({
        error: false,
        message: '',
    });

    const catchError = (message: string, status: number) => {
        setNotification(true);
        if(status === 404) {
            setErrorMessage({error: true, message: 'Вы уже одобрили или отклонили ранее'});
        } else {
            setErrorMessage({error: true, message});
        }
        confirmClickClose();
    }

    const confirmClick = () => {
        if(sessionId) {
            if(cinfirm) {
                ClientDocumentsAPI.signDocument(sessionId, documentId).then(data => {
                    if(data.success === true) {
                        documentStatusSuccessAction(!documentStatusSuccess);
                        setDocumentStatus(DocumentStatus.Signed);
                        setNotification(true);
                        confirmClickClose();
                        setErrorMessage({error: false, message: 'Вы успешно одобрили документ!'});
                    }
                }).catch(({response}) => catchError(response.data.message, response.data.status));
            } else {
                ClientDocumentsAPI.refuseDocument(sessionId, documentId).then(data => {
                    if(data.success === true) {
                        documentStatusSuccessAction(!documentStatusSuccess);
                        setDocumentStatus(DocumentStatus.Refused);
                        setNotification(true);
                        confirmClickClose();
                        setErrorMessage({error: false, message: 'Вы успешно отклонили документ!'});
                        setGoBack && setGoBack(true);
                    }
                }).catch(({response}) => catchError(response.data.message, response.data.status));
            }
        }
    }
    return (
        <>
        <Dialog
            open={openConfirm}
            className="modal confirm"
        >
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <p className="modal__text">{text}</p>
            </DialogContent>
            <DialogActions className="modal__actions">
                <Button onClick={confirmClickClose} color="primary">Отмена</Button>
                <Button onClick={confirmClick} variant="contained" color={cinfirm ? "primary" : "secondary"} disableElevation>{buttonText}</Button>
            </DialogActions>
        </Dialog>
        <SnackbarAlert 
            notification={notification}
            setNotification={setNotification} 
            message={errorMessage.message}
            severity={errorMessage.error ? "error" : "success"}
            vertical="top" 
            horizontal="center" />
        </>
    );
}

const mapStateToProps = (state: RootState) => ({
    sessionId: state.registration.sessionId,
    documentStatusSuccess: state.registration.documentStatusSuccess
});

const mapDispatchToProps = (dispatch: Dispatch<Action> & ThunkDispatch<any, any, AnyAction>) => ({
    documentStatusSuccessAction: (documentStatusSuccess: boolean) => dispatch(actions.registration.documentStatusSuccessAction(documentStatusSuccess)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmModal);