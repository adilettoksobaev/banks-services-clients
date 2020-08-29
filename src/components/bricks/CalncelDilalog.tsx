import React, { Dispatch } from 'react';
import { connect } from 'react-redux';
import { actions } from '../../store';
import { ThunkDispatch } from 'redux-thunk';
import { Action, AnyAction } from 'redux';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { localStorageRemoveItem } from '../../utils/storage';

type Props = ReturnType<typeof mapDispatchToProps> & {
    openCancel: boolean;
    cencelClickClose: () => void;
    backHistory: string;
    logout?: boolean;
}

const CalncelDilalog:React.FC<Props> = ({ openCancel, cencelClickClose, backHistory, logout, isAuthorizedAction }) => {
    let history = useHistory();

    const cancelClick = () => {
        cencelClickClose();
        if(logout && logout === true) {
            localStorageRemoveItem('regSessionId');
            isAuthorizedAction(false);
            return history.push('/')
        };
        return history.push(backHistory);
    }

    return (
        <Dialog
            open={openCancel}
            className="modal cancel">
            <DialogTitle>Отмена</DialogTitle>
            <DialogContent>
                <p className="modal__text">Вы уверены что хотите отменить?</p>
            </DialogContent>
            <DialogActions>
                <Button onClick={cencelClickClose} color="secondary" size="small">Нет</Button>
                <Button onClick={cancelClick} color="primary" size="small">Да</Button>
            </DialogActions>
        </Dialog>
    );
}

const mapDispatchToProps = (dispatch: Dispatch<Action> & ThunkDispatch<any, any, AnyAction>) => ({
    isAuthorizedAction: (isAuthorized: boolean) => dispatch(actions.registration.isAuthorizedAction(isAuthorized))
});

export default connect(null, mapDispatchToProps)(CalncelDilalog);