import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../store';
import ArrowBackIosRoundedIcon from '@material-ui/icons/ArrowBackIosRounded';
import Profile from '../Profile/Profile';
import { IUserInfo } from '../../api/SessionAPI';
import { ClientAPI, IBankAccounts } from '../../api/ClientAPI';
import { TextField } from '@material-ui/core';

type Props = ReturnType<typeof mapStateToProps> & {
    userInfo: IUserInfo;
}

const PaymentAccount:React.FC<Props> = ({ userInfo, sessionId }) => {
    const [goBack, setGoBack] = useState(false);
    const [bankAccounts, setBankAccounts] = useState<IBankAccounts[]>([]);

    useEffect(() => {
        if(sessionId) {
            ClientAPI.getBankAccounts(sessionId, userInfo.userId).then(data => {
                setBankAccounts(data);
            }).catch(({response}) => console.log(response.data.message));
        }
    }, [sessionId, userInfo]);

    if(goBack) {
        return <Profile userInfo={userInfo} />
    }
    return (
        <div className="document paymentAccount">
            <div className="cancel" onClick={() => setGoBack(true)}><ArrowBackIosRoundedIcon /></div>
            <div className="title">Расчетные счета</div>
            {bankAccounts.map(bankAccount => (
                <TextField 
                    key={'textField' + bankAccount.accountValue}
                    disabled
                    label={bankAccount.accountType}
                    value={bankAccount.accountValue}
                    fullWidth />
            ))}
        </div>
    );
}

const mapStateToProps = (state: RootState) => ({
    sessionId: state.registration.sessionId,
});

export default connect(mapStateToProps)(PaymentAccount);