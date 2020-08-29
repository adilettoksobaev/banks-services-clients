import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom';

type Props = {
    confirm: boolean;
    confirmClose: () => void;
}

const ConfirmationDialog: React.FC<Props> = ({confirm, confirmClose}) => {
    let history = useHistory();
    return (
        <Dialog
            open={confirm}>
            <DialogTitle id="alert-dialog-title">Внимание!</DialogTitle>
            <DialogContent>
                Вы подтверждаете верность данных?
            </DialogContent>
            <DialogActions>
                <Button onClick={confirmClose} color="primary">Нет</Button>
                <Button onClick={() => history.push('/registration')} color="primary" autoFocus>Да</Button>
            </DialogActions>
        </Dialog>
    );
}

export default ConfirmationDialog;