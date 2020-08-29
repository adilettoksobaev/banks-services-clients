import React, { useState } from 'react';
import { Button, FormControl, Input, InputAdornment, InputLabel, FormHelperText } from '@material-ui/core';
import { LogoIcon } from '../../icons/icons';
import ArrowBackIosRoundedIcon from '@material-ui/icons/ArrowBackIosRounded';

const InnEnter = () => {
    const [next, setNext] = useState(false);
    const [innOrganisation, setOrganisation] = useState('');
    const [innEmployee, setInnEmployee] = useState('');
    const [helperText, setHelperText] = useState('ОсОО «Яблоня»');

    const innOrganisationView = () => {
        return (
            <div className="authorization__form">
                <FormControl fullWidth>
                    <InputLabel>Введите ИНН Организа</InputLabel>
                    <Input
                        inputProps={{
                            maxLength: 14,
                        }}
                        value={innOrganisation}
                        onChange={(event) => setOrganisation(event.target.value)}
                        endAdornment={
                            <InputAdornment position="end">
                                <span className="authorization__count">{innOrganisation.length}/14</span>
                            </InputAdornment>
                        }
                    />
                    <FormHelperText>{helperText}</FormHelperText>
                </FormControl>
                <div className="btnRow">
                    <Button 
                        onClick={phoneClick} 
                        fullWidth 
                        variant="contained" 
                        color="primary" 
                        disableElevation
                        disabled={innOrganisation.length === 14 ? false : true}>Далее</Button>
                </div>
            </div>
        )
    }

    const innEmployeeView = () => {
        return (
            <div className="authorization__form">
                <FormControl fullWidth>
                    <InputLabel>Введите ИНН Организа</InputLabel>
                    <Input
                        inputProps={{
                            maxLength: 14,
                        }}
                        value={innEmployee}
                        onChange={(event) => setInnEmployee(event.target.value)}
                        endAdornment={
                            <InputAdornment position="end">
                                <span className="authorization__count">{innEmployee.length}/14</span>
                            </InputAdornment>
                        }
                    />
                    <FormHelperText>{helperText}</FormHelperText>
                </FormControl>
                <div className="btnRow">
                    <Button 
                        onClick={phoneClick} 
                        fullWidth 
                        variant="contained" 
                        color="primary" 
                        disableElevation
                        disabled={innEmployee.length === 14 ? false : true}>Далее</Button>
                </div>
            </div>
        )
    }

    const phoneClick = () => {
        setNext(true);
    }

    return (
        <>
            {next && <div onClick={() =>  setNext(false)} className="back"><ArrowBackIosRoundedIcon />Назад</div>}
            <div className="title">Вход в систему</div>
            <div className="authorization__logo"><LogoIcon /></div>
            {!next ? innOrganisationView() : innEmployeeView()}
        </>
    );
}

export default InnEnter;