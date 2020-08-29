import React from 'react';
import { Button } from '@material-ui/core';
import { VideoIcon } from '../../icons/icons';

const BusyOperators = () => {
    return (
        <div className="content videoCall busyOperators">
            <div className="content__head">
                <Button className="cancel" color="primary" onClick={() => window.location.reload(false)}>Закрыть</Button>
                <span className="content__headTitle">Видеозвонок</span>
            </div>
            <div className="title">Извините, все операторы заняты.</div>
            <div className="icon"><VideoIcon /></div>
            <div className="btnRow">
                <div className="busyTitle">Оператор сам свяжеться с вами в ближайшее время</div>
                <Button 
                    fullWidth 
                    variant="contained" 
                    color="primary" 
                    disableElevation
                    onClick={() => window.location.reload(false)}>Ок</Button>
            </div>
        </div>
    );
}

export default BusyOperators;