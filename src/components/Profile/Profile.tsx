import React, { Dispatch, useState } from 'react';
import { connect } from 'react-redux';
import { RootState, actions } from '../../store';
import { ThunkDispatch } from 'redux-thunk';
import { Action, AnyAction } from 'redux';
import { Avatar, Button } from '@material-ui/core';
import { IUserInfo, SessionAPI } from '../../api/SessionAPI';
import { DocumentIcon, NextIcon, LangIcon, PaymentIcon } from '../../icons/icons';
import Contracts from '../bricks/Contracts';
import { baseUrl } from '../../utils/baseUrl';
import PaymentAccount from '../bricks/PaymentAccount';
import LanguageDialog from '../bricks/LanguageDialog';
import { useHistory } from 'react-router-dom';

type Props = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps> & {
    userInfo: IUserInfo
}

const Profile:React.FC<Props> = (props) => {
    const { userInfo, contractListOpen, contractListOpenAction, sessionId, settings, logoutAction } = props;
    let history = useHistory();
    const [paymentListOpen, setPaymentListOpen] = useState(false);
    const [lanOpen, setLanOpen] = useState(false);

    const langClickOpen = () => {
        setLanOpen(true);
    }

    const langClickClose = () => {
        setLanOpen(false);
    }

    const logoutClick = () => {
        if(sessionId) {
            SessionAPI.closeSession(sessionId);
            logoutAction();
            return history.push('/');
        }
    }

    return (
        <>
            {!contractListOpen &&  !paymentListOpen && 
                <div className="content passwordData profile">
                    <div className="title">Профиль</div>
                    <div className="profile__content">
                        {sessionId && settings &&  
                            <Avatar className="profile__avatar" src={`${baseUrl()}api/Client/GetUserPhoto/${sessionId}/${userInfo.userId}/photo/${settings.apiKey}`}>{userInfo.fullName.substr(0, 1)}</Avatar>
                        }
                        <div className="profile__name">{userInfo.fullName}</div>
                    </div>
                    <div className="documentBlock" onClick={() => contractListOpenAction(true)}>
                        <div className="documentBlock__icon"><DocumentIcon /></div>
                        <div>
                            <div className="documentBlock__title">Договоры</div>
                        </div>
                        <div className="documentBlock__endIcon"><NextIcon /></div>
                    </div>
                    <div className="documentBlock" onClick={() => setPaymentListOpen(true)}>
                        <div className="documentBlock__icon"><PaymentIcon /></div>
                        <div>
                            <div className="documentBlock__title">Расчетные счета</div>
                        </div>
                        <div className="documentBlock__endIcon"><NextIcon /></div>
                    </div>
                    <div className="documentBlock" onClick={langClickOpen}>
                        <div className="documentBlock__icon"><LangIcon /></div>
                        <div>
                            <div className="documentBlock__title">Язык - русский</div>
                        </div>
                        <div className="documentBlock__endIcon"><NextIcon /></div>
                    </div>
                    <div className="exitRow"><Button onClick={logoutClick} color="primary" className="exit">Выйти</Button></div>
                </div>
            }
            {contractListOpen &&
                <Contracts userInfo={userInfo} />      
            }
            {paymentListOpen && 
                <PaymentAccount userInfo={userInfo} />
            }
            <LanguageDialog lanOpen={lanOpen} langClickClose={langClickClose} />
        </>
    );
}

const mapStateToProps = (state: RootState) => ({
    sessionId: state.registration.sessionId,
    contractListOpen: state.registration.contractListOpen,
    settings: state.registration.settings,
});

const mapDispatchToProps = (dispatch: Dispatch<Action> & ThunkDispatch<any, any, AnyAction>) => ({
    contractListOpenAction: (contractListOpen: boolean) => dispatch(actions.registration.contractListOpenAction(contractListOpen)),
    logoutAction: () => dispatch(actions.registration.logoutAction()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);