import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';

type Props = {
    notification: boolean;
    setNotification: React.Dispatch<React.SetStateAction<boolean>>;
    message: string;
    severity: "success" | "info" | "warning" | "error";
    vertical: "top" | "bottom";
    horizontal: "left" | "center" | "right";
}

const SnackbarAlert:React.FC<Props> = ({ notification, setNotification, message, severity, vertical, horizontal }) => {

    const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setNotification(false);
    };

    return (
        <Snackbar 
            open={notification} 
            autoHideDuration={6000} 
            onClose={handleClose}
            anchorOrigin={{vertical: vertical, horizontal: horizontal}}>
            <Alert onClose={handleClose} severity={severity}>
                {message}
            </Alert>
        </Snackbar>
    );
}

export default SnackbarAlert

function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}