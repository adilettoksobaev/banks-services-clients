import React from 'react';
import { Dialog, DialogContent, DialogActions, Button } from '@material-ui/core';

type Props = {
    confirm: boolean;
    confirmClose: () => void;
    phone: string;
}

const RegistrationDialog: React.FC<Props> = ({ confirm, confirmClose, phone }) => {
    
    return (
        <Dialog
            open={confirm}>
            <DialogContent>
                <strong className="center">Номер {phone} не зарегистрирован</strong>
            </DialogContent>
            <DialogActions>
                <div className="justify-space-around">
                    <Button onClick={confirmClose} color="primary">Отмена</Button>
                    <Button color="primary" autoFocus>Регистрация</Button>
                </div>
            </DialogActions>
        </Dialog>
    );
}

export default RegistrationDialog;