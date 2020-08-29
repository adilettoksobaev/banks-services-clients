import React, { Dispatch, useState } from 'react';
import { connect } from 'react-redux';
import { RootState, actions } from '../../store';
import { ThunkDispatch } from 'redux-thunk';
import { Action, AnyAction } from 'redux';
import { baseUrl } from '../../utils/baseUrl';
import ArrowBackIosRoundedIcon from '@material-ui/icons/ArrowBackIosRounded';
import { Button, FormControlLabel, Checkbox } from '@material-ui/core';
import ConfirmModal from './ConfirmModal';
import { IContract } from '../../api/ClientDocumentsAPI';
import { SignedIcon } from '../../icons/icons';
import Moment from 'react-moment';
import 'moment/locale/ru';
import { IUserInfo } from '../../api/SessionAPI';
import Contracts from './Contracts';

type Props = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps> & {
    contract: IContract;
    userInfo: IUserInfo;
    setCurrentContract?: React.Dispatch<React.SetStateAction<IContract | null>>
}

const ContractInfo:React.FC<Props> = ({ sessionId, settings, contract, userInfo, setCurrentContract, tabValueAction, contractListOpenAction }) => {
    const [openConfirm, setOpenConfirm] = useState(false);
    const [openConfirmReject, setOpenConfirmReject] = useState(false);
    const [documentStatus, setDocumentStatus] = useState(contract.documentStatus);
    const [agree, setAgree] = useState(false);
    const [goBack, setGoBack] = useState(false);

    const confirmClickOpen = () => {
        setOpenConfirm(true);
    }

    const confirmClickClose = () => {
        setOpenConfirm(false);
    }

    const confirmClickOpenReject = () => {
        setOpenConfirmReject(true);
    }

    const confirmClickCloseReject = () => {
        setOpenConfirmReject(false);
    }

    if(goBack) {
        if(setCurrentContract) {
            setCurrentContract(null);
            tabValueAction(2);
            contractListOpenAction(true);
        }
        return <Contracts userInfo={userInfo} />
    }

    return (
        <div className="contractInfo">
            <div className="cancel" onClick={() => setGoBack(true)}><ArrowBackIosRoundedIcon /></div>
            
            {sessionId && settings && 
                <iframe className="documentIframe" src={`${baseUrl()}api/ClientDocuments/GetContract/${sessionId}/${contract.documentId}/${settings.apiKey}`} title="description"></iframe>
            }
            {documentStatus === "Signed" &&
                <div className="signedContract">
                    <div className="signedContract__item">
                        {settings && 
                            <div className="signedContract__label">Организация: <strong>{settings.name}</strong></div>
                        }
                        <div className="signedContract__label">Сотрудник: <strong>Сотрудник банка</strong></div>
                    </div>
                    <div className="signedContract__item">
                        <div className="signedContract__label">Клиент: <strong>{userInfo.fullName}</strong></div>
                    </div>
                    <div className="signed__signature">
                        Подписан: <span><Moment format="DD.MM.YYYY">{contract.createdDate}</Moment></span> в <span><Moment format="hh:mm:ss">{contract.createdDate}</Moment></span>
                    </div>
                    <div className="signed__item">
                        <div className="signed__icon"><SignedIcon /></div>
                        Подписано квалифициронной электронной подписью
                    </div>
                </div>
            }
            {documentStatus === "New" && 
                <div className="btnRow">
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={agree}
                                onChange={(event) => setAgree(event.target.checked)}
                                name="checkedB"
                                color="primary"
                            />
                        }
                        label="Согласен с условиями"
                    />
                    <Button 
                        fullWidth 
                        variant="contained" 
                        color="secondary" 
                        disableElevation
                        disabled={!agree}
                        onClick={confirmClickOpenReject}>Отклонить</Button>
                    <Button 
                        fullWidth 
                        variant="contained" 
                        color="primary" 
                        disableElevation
                        disabled={!agree}
                        onClick={confirmClickOpen}>Подписать</Button>
                </div>
            }
            <ConfirmModal 
                openConfirm={openConfirm}
                confirmClickClose={confirmClickClose}
                title="Подтверждение"
                text="Вы уверены, что хотите подписать документ?"
                buttonText="Подтвердить" 
                cinfirm={true} 
                documentId={contract.documentId}
                setDocumentStatus={setDocumentStatus} />
            <ConfirmModal 
                openConfirm={openConfirmReject}
                confirmClickClose={confirmClickCloseReject}
                title="Заявка"
                text="Вы уверены, что хотите отклонить документ?"
                buttonText="Да" 
                cinfirm={false} 
                documentId={contract.documentId} 
                setDocumentStatus={setDocumentStatus} 
                setGoBack={setGoBack}/>
        </div>
    );
}

const mapStateToProps = (state: RootState) => ({
    sessionId: state.registration.sessionId,
    settings: state.registration.settings,
});

const mapDispatchToProps = (dispatch: Dispatch<Action> & ThunkDispatch<any, any, AnyAction>) => ({
    tabValueAction: (tabValue: number) => dispatch(actions.registration.tabValueAction(tabValue)),
    contractListOpenAction: (contractListOpen: boolean) => dispatch(actions.registration.contractListOpenAction(contractListOpen)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ContractInfo);