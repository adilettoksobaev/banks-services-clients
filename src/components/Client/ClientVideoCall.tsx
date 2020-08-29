import React, { Dispatch, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RootState, actions } from '../../store';
import { ThunkDispatch } from 'redux-thunk';
import { Action, AnyAction } from 'redux';
import { ClientAPI } from '../../api/ClientAPI';
import { Button, Backdrop, CircularProgress } from '@material-ui/core';
import { SessionAPI } from '../../api/SessionAPI';
import { useHistory } from 'react-router-dom';
import Icon from '@material-ui/core/Icon';
import { icons } from '../../utils/icons';
import { colors } from '../../utils/colors';
import { InstanceHead } from '../../api/InstanceHead';
import Axios from 'axios';
import PanoramaFishEyeIcon from '@material-ui/icons/PanoramaFishEye';
import BusyOperators from '../Registration/BusyOperators';
import VideoCall from '../Registration/VideoCall';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

type Props = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
  }),
);
interface IDepartment {
    departmentId: number,
    departmentName: string,
    clientRegistration: boolean,
    colorId: number,
    iconId: number,
}


const ClientVideoCall:React.FC<Props> = ({ sessionId, logoutAction }) => {
    const classes = useStyles();
    let history = useHistory();
    const [departments, setDepartments] = useState<IDepartment[]>([]);
    const [conferenceJoinLink, setConferenceJoinLink] = useState('');
    const [requestId, setRequestId] = useState<number | null>(null);
    const [status, setStaus] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const settingsUrl = `/companiesSettings/${window.location.hostname}/settings.json`;
        Axios.get(settingsUrl).then(res => {
            InstanceHead.init(res.data.apiKey);
            if(sessionId) {
                ClientAPI.getDepartments(sessionId).then(data => {
                    setDepartments(data);
                }).catch(({response}) => alert(response));
            }
        });
    }, [sessionId]);

    const departmentClick = (departmentId: number) => {
        if(sessionId) {
            setLoading(true);
            ClientAPI.startVideoCallForClient(sessionId, departmentId).then(data => {
                setRequestId(data.requestId);
                setConferenceJoinLink(data.conferenceJoinLink);
            })
        }
    }

    useEffect(() => {
        if(sessionId && requestId) {
            if(window.location.pathname === '/client') {
                const getVideoModerationStatusInterval = setInterval(() => {
                    ClientAPI.getVideoCallStatus(sessionId, requestId).then(data => {
                        setStaus(data.status);
                        setLoading(false);
                        if(data.status === 'conversationIsOver' || data.status === 'responseTimeout') {
                            setRequestId(null);
                            return () => clearInterval(getVideoModerationStatusInterval);
                        }
                    }).catch(({response}) => alert(response.data.message));
                }, 1500);
                return () => clearInterval(getVideoModerationStatusInterval);
            }
        }
    }, [sessionId, requestId]);

    if(status === 'waitingOperator') {
        return <VideoCall />
    }

    if(status === 'responseTimeout') {
        return <BusyOperators />
    }

    if(status === 'activeConversation' && conferenceJoinLink !== '') {
        return <iframe src={conferenceJoinLink} className="iframeContent" allow="camera;microphone" title="video call"></iframe>
    }

    const logoutClick = () => {
        if(sessionId) {
            SessionAPI.closeSession(sessionId);
            logoutAction();
            return history.push('/');
        }
    }

    return (
        <div className="content clientVideoCall">
            <div className="title">Выберите специалиста</div>
            {departments.map(department => {
                const currentColor = colors.find(color => color.id === department.colorId);
                const currentIcon = icons.find(icon => icon.id === department.iconId);
                return (
                    <div
                        style={{backgroundColor: currentColor ? currentColor.name : '#50BF34'}} 
                        className="clientVideoCall__item" 
                        key={department.departmentId}
                        onClick={() => departmentClick(department.departmentId)}>
                        <Icon className="clientVideoCall__icon">{currentIcon ? currentIcon.name : <PanoramaFishEyeIcon />}</Icon>
                        <span>{department.departmentName}</span>
                    </div>
                )
            })}
            <Backdrop className={classes.backdrop} open={loading}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <div className="desc">Режим работы <br /> пн - пт с 10.00 до 17.30</div>
            <div className="exitRow"><Button onClick={logoutClick} color="primary" className="exit">Выйти</Button></div>
        </div>
    );
}

const mapStateToProps = (state: RootState) => ({
    regSessionId: state.registration.regSessionId,
    sessionId: state.registration.sessionId,
});

const mapDispatchToProps = (dispatch: Dispatch<Action> & ThunkDispatch<any, any, AnyAction>) => ({
    logoutAction: () => dispatch(actions.registration.logoutAction()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ClientVideoCall);