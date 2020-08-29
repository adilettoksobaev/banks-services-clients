import React, { Dispatch, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState, actions } from '../../store';
import { ThunkDispatch } from 'redux-thunk';
import { Action, AnyAction } from 'redux';
import { DocumentIcon, NextIcon } from '../../icons/icons';
import Moment from 'react-moment';
import 'moment/locale/ru';
import { ClientDocumentsAPI, IContract } from '../../api/ClientDocumentsAPI';
import ContractInfo from '../bricks/ContractInfo';
import ArrowBackIosRoundedIcon from '@material-ui/icons/ArrowBackIosRounded';
import { IUserInfo } from '../../api/SessionAPI';
import Profile from '../Profile/Profile';

type Props = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps> & {
    userInfo: IUserInfo;
}

const Contracts:React.FC<Props> = (props) => {
    const { sessionId, userInfo, contractListOpenAction } = props;
    const [contracts, setContracts] = useState<IContract[]>([]);
    const [contract, setContract] = useState<IContract | null>(null);
    const [constractDetail, setConstractDetail] = useState(false);
    const [goBack, setGoBack] = useState(false);

    useEffect(() => {
        if(sessionId) {
            ClientDocumentsAPI.getContracts(sessionId, userInfo.userId).then(data => {
                setContracts(data);
            }).catch(({response}) => alert(response));
        }   
    }, [sessionId, userInfo.userId]);

    const constractClick = (contract: IContract) => {
        setContract(contract);
        setConstractDetail(true);
    }

    const signedPaymentOrders = contracts.filter(contract => contract.documentStatus === "Signed");

    if(goBack) {
        contractListOpenAction(false);
        return <Profile userInfo={userInfo} />
    }

    return (
        <>
        {!constractDetail &&
            <div className="document">
                <div className="cancel" onClick={() => setGoBack(true)}><ArrowBackIosRoundedIcon /></div>
                <div className="title">Договоры</div>
                <div className="tabPanel__date"><Moment format="D MMMM YYYY">{new Date()}</Moment></div>
                {signedPaymentOrders.map(constract => (
                    <div key={'doc-' + constract.documentId} className="documentBlock" onClick={() => constractClick(constract)}>
                        <div className="documentBlock__icon"><DocumentIcon /></div>
                        <div>
                            <div className="documentBlock__title">{constract.documentDescription}</div>
                        </div>
                        <div className="documentBlock__endIcon"><NextIcon /></div>
                    </div>
                ))}
            </div>
        }
        {constractDetail && contract &&
            <ContractInfo 
                contract={contract}
                userInfo={userInfo} />
        }
        </>
    );
}

const mapStateToProps = (state: RootState) => ({
    sessionId: state.registration.sessionId,
});

const mapDispatchToProps = (dispatch: Dispatch<Action> & ThunkDispatch<any, any, AnyAction>) => ({
    contractListOpenAction: (contractListOpen: boolean) => dispatch(actions.registration.contractListOpenAction(contractListOpen)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Contracts);