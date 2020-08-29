import React, { useState } from 'react';
import { DesctopIcon, FaceIcon, PasswordIcon } from '../../icons/icons';
import { Button } from '@material-ui/core';
import { NavLink } from 'react-router-dom';
import CalncelDilalog from '../bricks/CalncelDilalog';
import PhotoFace from './PhotoFace';

type Props = {
    guestReg: boolean;
}
const StepIndividual:React.FC<Props> = ({ guestReg }) => {
    const [openCancel, setOpenCancel] = useState(false);
    const [guestPhotoFace, setGuestPhotoFace] = useState(false);

    const cencelClickOpen = () => {
        setOpenCancel(true);
    }

    const cencelClickClose = () => {
        setOpenCancel(false);
    }

    return (
        <>
            {!guestPhotoFace ?
                <div className="content stepIndividual">
                    <Button className="cancel" color="primary" onClick={cencelClickOpen}>Отменить</Button>
                    <div className="title">Шаги регистрации физического лица</div>
                    <div className="icon"><DesctopIcon /></div>
                    <ul className="stepIndividual__ul">
                        <li className="stepIndividual__li">
                            <div className="stepIndividual__icon"><FaceIcon /></div>
                            <div className="stepIndividual__label">Фото лица</div>
                        </li>
                        <li className="stepIndividual__li">
                            <div className="stepIndividual__icon"><PasswordIcon /></div>
                            <div className="stepIndividual__label">Фото паспорта</div>
                        </li>
                    </ul>
                    <div className="btnRow">
                        {guestReg ?
                            <Button 
                                fullWidth 
                                variant="contained" 
                                color="primary" 
                                disableElevation
                                onClick={() => setGuestPhotoFace(true)}>Продолжить</Button>
                        :
                            <NavLink to="/photo-face">
                                <Button 
                                    fullWidth 
                                    variant="contained" 
                                    color="primary" 
                                    disableElevation>Продолжить</Button>
                            </NavLink>
                        }
                    </div>
                    <CalncelDilalog 
                        openCancel={openCancel}
                        cencelClickClose={cencelClickClose} 
                        backHistory="/" 
                        logout={true} />
                </div>
                : <PhotoFace guestPhotoFace={guestPhotoFace} />
            }
        </> 
    );
}

export default StepIndividual;