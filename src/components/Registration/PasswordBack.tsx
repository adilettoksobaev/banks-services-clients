import React, { useState } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../store';
import { Button, CircularProgress } from '@material-ui/core';
import { BackPasswordIcon } from '../../icons/icons';
import { useHistory } from 'react-router-dom';
import { RegistrationAPI } from '../../api/RegistrationAPI';
import SnackbarAlert from '../bricks/SnackbarAlert';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import CalncelDilalog from '../bricks/CalncelDilalog';
import imageCompression from 'browser-image-compression';
import PasswordData from './PasswordData';

type Props = ReturnType<typeof mapStateToProps> & {
    guestPasswordBack: boolean;
}

const PasswordBack: React.FC<Props> = (props) => {
    let history = useHistory();
    const { regSessionId, guestPasswordBack } = props;
    const [selectedFile, setSelectedFile] = useState<File | Blob | null>(null);
    const [imgUrl, setImgUrl] = useState<string | null>(null);
    const [notification, setNotification] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState({
        error: false,
        message: '',
    });
    const [openCancel, setOpenCancel] = useState(false);
    const [guestPasswordData, setGuestPasswordData] = useState(false);

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

    const uploadPhotoChange = async (event: any) => {
        const imageFile = event.target.files[0]; 
        const options = {
            maxSizeMB: 2,
            maxWidthOrHeight: 1920,
            useWebWorker: true
        }
        try {
            const compressedFile = await imageCompression(imageFile, options);
            
            setSelectedFile(compressedFile);
            setImgUrl(URL.createObjectURL(compressedFile));
        } catch (error) {
            alert(error);
        }
        // setSelectedFile(event.target.files[0]);
        // if(event.target.files[0]) {
        //     setImgUrl(URL.createObjectURL(event.target.files[0]));
        // }
    }

    const uploadUserPhotoClick = () => {
        setLoading(true);
        let formData = new FormData();
        const passportVersion = 'new';
        if(regSessionId && selectedFile) {
            formData.append("file", selectedFile!);
            RegistrationAPI.uploadPassportBack(regSessionId, passportVersion, formData).then(data => {
                if(data.status === 'success') {
                    setLoading(false);
                    setNotification(false);
                    if(guestPasswordBack) {
                        setGuestPasswordData(true);
                    } else {
                        return history.push('/password-data');
                    }
                } else {
                    catchError(data.message);
                }
            }).catch(({response}) => catchError(response.data.message));
        }
    }
    return (
        <>
        {!guestPasswordData ?
        <div className="content passwordFace">
            <Button className="cancel" color="primary" onClick={cencelClickOpen}>Отменить</Button>
            <div className="title">Фото оборотной стороны паспорта </div>
            <div className="icon">
                {imgUrl ? 
                    <img src={imgUrl} alt="" /> :
                    <BackPasswordIcon />
                }
            </div>
            
            <div className="btnRow">
                <div className="uploadPhoto">
                    <input
                        accept="image/*"
                        id="contained-button-file"
                        type="file"
                        onChange={uploadPhotoChange}
                        className="uploadPhoto__input"
                    />
                    <label htmlFor="contained-button-file">
                        {imgUrl ? 
                            <Button  disableElevation fullWidth 
                                variant="contained" className="orangeColor" component="span" 
                                startIcon={<CloudUploadIcon />}>Выбрать другое фото</Button>
                            : 
                            <Button  disableElevation fullWidth 
                            variant="contained" color="primary" component="span" 
                            startIcon={<CloudUploadIcon />}>Добавить фото</Button>
                        }
                    </label>
                </div>
                {imgUrl && 
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
                        onClick={uploadUserPhotoClick}>Продолжить</Button>
                }
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
                backHistory="/stepIndividual" />
        </div>
        : <PasswordData guestPasswordData={guestPasswordData}  />}
        </>
    );
}

const mapStateToProps = (state: RootState) => ({
    regSessionId: state.registration.regSessionId,
});

export default connect(mapStateToProps)(PasswordBack);