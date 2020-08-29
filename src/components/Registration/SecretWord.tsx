import React from 'react';
import { Button, TextField } from '@material-ui/core';
import ArrowBackIosRoundedIcon from '@material-ui/icons/ArrowBackIosRounded';

const SecretWord = () => {
    return (
        <div className="content secretWord">
            <div className="secretWord__head">
                <Button className="cancel" color="primary"><ArrowBackIosRoundedIcon />Назад</Button>
                <span className="secretWord__headTitle">Секретное слово</span>
            </div>
            <div className="title">Придумайте <br /> секретное слово</div>
            <div className="secretWord__desc">Секретное слово необходимо для будущей идентификации</div>
            <TextField
                fullWidth
                label="Секретное слово" 
                value="Клубничка" />
            <div className="secretWord__nobody">Запомните секретное слово <br /> и <br /> НИКОМУ его не сообщайте!</div>
            <div className="btnRow">
                <Button 
                    fullWidth 
                    variant="contained" 
                    color="primary" 
                    disableElevation>Продолжить</Button>
            </div>
        </div>
    );
}

export default SecretWord;