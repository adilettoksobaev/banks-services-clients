import React, { Dispatch } from 'react';
import { connect } from 'react-redux';
import { actions } from '../../store';
import { ThunkDispatch } from 'redux-thunk';
import { Action, AnyAction } from 'redux';
import { WarningIcon } from '../../icons/icons';
import { Button } from '@material-ui/core';
import { localStorageRemoveItem } from '../../utils/storage';
import { useHistory } from 'react-router-dom';

type Props = ReturnType<typeof mapDispatchToProps>

const NotPassChecked:React.FC<Props> = ({ isAuthorizedAction }) => {
    let history = useHistory();
    const handleClick = () => {
        localStorageRemoveItem('regSessionId');
        isAuthorizedAction(false);
        return history.push('/');
    }

    return (
        <div className="content congratulate">
            <div className="title">Ваша заявка не прошла проверку</div>
            <div className="icon"><WarningIcon /></div>
            <div className="btnRow">
                <div className="congratulate__desc">Обратитесь в Центр Обслуживания</div>
                <Button 
                    fullWidth 
                    variant="contained" 
                    color="primary" 
                    disableElevation
                    onClick={handleClick}>Готово</Button>
            </div>
        </div>
    );
}

const mapDispatchToProps = (dispatch: Dispatch<Action> & ThunkDispatch<any, any, AnyAction>) => ({
    isAuthorizedAction: (isAuthorized: boolean) => dispatch(actions.registration.isAuthorizedAction(isAuthorized))
});

export default connect(null, mapDispatchToProps)(NotPassChecked);