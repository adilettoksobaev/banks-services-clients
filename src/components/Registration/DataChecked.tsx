import React from 'react';
import { CheckIcon } from '../../icons/icons';
import { Button } from '@material-ui/core';

const DataChecked = () => {
    return (
        <div className="content congratulate">
            <div className="title">Ваши регистрационные данные проверяются</div>
            <div className="icon"><CheckIcon /></div>
            <div className="btnRow">
                <div className="congratulate__desc">Проверка осуществляется только в рабочие дни</div>
                <Button 
                    fullWidth 
                    variant="contained" 
                    color="primary" 
                    disableElevation>ОК</Button>
            </div>
        </div>
    );
}

export default DataChecked;