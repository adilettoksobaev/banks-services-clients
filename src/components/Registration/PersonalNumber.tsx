import React from 'react';
import { Button } from '@material-ui/core';
import NewPassword from '../../img/newPassword.jpg';
import OldPassword from '../../img/oldPassword.jpg';
import { useHistory } from 'react-router-dom';

const PersonalNumber = () => {
    let history = useHistory();
    return (
        <div className="content personalNumber">
            <div className="title">Персональный номер</div>
            <div className="personalNumber__icon">
                <div className="personalNumber__title">Паспорт нового образца</div>
                <img src={NewPassword} alt=""/>
            </div>
            <div className="personalNumber__icon">
                <div className="personalNumber__title">Паспорт нового образца</div>
                <img src={OldPassword} alt=""/>
            </div>
            <div className="btnRow">
                <Button 
                    fullWidth 
                    variant="contained" 
                    color="primary" 
                    disableElevation
                    onClick={() => history.goBack()}>Назад</Button>
            </div>
        </div>
    );
}

export default PersonalNumber;