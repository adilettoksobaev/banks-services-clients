import React, { Dispatch, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState, actions } from '../../store';
import { ThunkDispatch } from 'redux-thunk';
import { Action, AnyAction } from 'redux';
// import ClientVideoCall from './ClientVideoCall';
import Documents from './Documents';
import Profile from '../Profile/Profile';
import { Backdrop, CircularProgress, Button, Icon, IconButton } from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import { InstanceHead } from '../../api/InstanceHead';
import Axios from 'axios';
import { ClientAPI } from '../../api/ClientAPI';
import VideoCall from '../Registration/VideoCall';
import BusyOperators from '../Registration/BusyOperators';
import { SessionAPI, IUserInfo } from '../../api/SessionAPI';
import { icons } from '../../utils/icons';
import { colors } from '../../utils/colors';
import PanoramaFishEyeIcon from '@material-ui/icons/PanoramaFishEye';
import Solve from '../bricks/Solve';
import { VideoIcon } from '../../icons/icons';
import ArrowBackIosRoundedIcon from '@material-ui/icons/ArrowBackIosRounded';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#019AE8',
      backgroundColor: "#fff"
    },
  }),
);

type Props = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>;

interface IDepartment {
    departmentId: number,
    departmentName: string,
    clientRegistration: boolean,
    colorId: number,
    iconId: number,
}
interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
}

const ClientPage:React.FC<Props> = ({ tabValue, sessionId, logoutAction, solve }) => {
    const classes = useStyles();
    let history = useHistory();
    const [departments, setDepartments] = useState<IDepartment[]>([]);
    const [conferenceJoinLink, setConferenceJoinLink] = useState('');
    const [requestId, setRequestId] = useState<number | null>(null);
    const [status, setStaus] = useState('');
    const [loading, setLoading] = useState(false);
    const [userInfo, setUserInfo] = useState<IUserInfo>({
        inn: "",
        fullName: "",
        userId: 0,
    });
    const [departmentId, setDepartmentId] = useState<number | null>(null);

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

    useEffect(() => {
        if(sessionId) {
            SessionAPI.getUserInfo(sessionId).then(data => {
                setUserInfo({inn: data.inn, fullName: data.fullName, userId: data.userId});
            })
        }
    }, [sessionId])

    const departmentClick = (id: number) => {
        setDepartmentId(id);
    }

    const startVideoClick = () => {
        if(sessionId && departmentId) {
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
                        if(data.status === 'waitingOperator') {
                            setDepartmentId(null);
                        }
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

    const logoutClick = () => {
        if(sessionId) {
            SessionAPI.closeSession(sessionId);
            logoutAction();
            return history.push('/');
        }
    }

    const TabPanel = (props: TabPanelProps) => {
        const { children, value, index, ...other } = props;
        return (
            <div
                role="tabpanel"
                hidden={tabValue !== index}
                {...other}
            >
                {tabValue === index && (
                    <div>
                        {children}
                    </div>
                )}
            </div>
        );
    }

    const openIframe = () => {
        if(!solve) {
            return <Solve />
        } else {
            return (
                <iframe style={tabValue === 0 ? {zIndex: 9, opacity: 1} : {}} src={conferenceJoinLink} className="iframeContent clientVideoIframe" allow="camera;microphone" title="video call"></iframe>
            )
        }
    }

    return (
        <>
            {(status === 'activeConversation' && conferenceJoinLink !== '') && 
                openIframe()
            }
            <Backdrop className={classes.backdrop} open={loading}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <TabPanel value={tabValue} index={0}>
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
                    <div className="desc">Режим работы <br /> пн - пт с 10.00 до 17.30</div>
                    <div className="exitRow"><Button onClick={logoutClick} color="primary" className="exit">Выйти</Button></div>
                </div>
                {departmentId && 
                    <div className="content videoCall">
                        <IconButton onClick={() => setDepartmentId(null)} className="prevButton">
                            <ArrowBackIosRoundedIcon />
                        </IconButton>
                        <div className="videoCall__mode">Режим работы <br /> пн - пт с 10.00 до 17.30</div>
                        <div className="icon"><VideoIcon /></div>
                        <div className="videoCall__btnRow">
                            <Button onClick={startVideoClick} variant="contained" color="primary" disableElevation>Начать видеозвонок</Button>
                        </div>
                    </div>
                }
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
                <Documents userInfo={userInfo} />
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
                <Profile userInfo={userInfo} />
            </TabPanel>
        </>
    );
}

const mapStateToProps = (state: RootState) => ({
    tabValue: state.registration.tabValue,
    sessionId: state.registration.sessionId,
    solve: state.registration.solve,
});

const mapDispatchToProps = (dispatch: Dispatch<Action> & ThunkDispatch<any, any, AnyAction>) => ({
    logoutAction: () => dispatch(actions.registration.logoutAction()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ClientPage);