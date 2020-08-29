import React from 'react';
import { Button, IconButton } from '@material-ui/core';
import { VideoIcon } from '../../icons/icons';
import ArrowBackIosRoundedIcon from '@material-ui/icons/ArrowBackIosRounded';

const VideoCall = () => {
    return (
        <div className="content videoCall">
            <IconButton onClick={() => window.location.reload(false)} className="prevButton">
                <ArrowBackIosRoundedIcon />
            </IconButton>
            <div className="title">Ожидайте ответа оператора</div>
            <div className="icon"><VideoIcon /></div>
            <div className="videoCall__round"></div>
            <div className="videoCall__btnRow">
                <Button variant="outlined" color="secondary" onClick={() => window.location.reload(false)}>Отменить видеозвонок</Button>
            </div>
        </div>
    );
}

export default VideoCall;