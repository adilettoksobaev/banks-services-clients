import React, { Dispatch } from 'react';
import { connect } from 'react-redux';
import { RootState, actions } from '../../store';
import { ThunkDispatch } from 'redux-thunk';
import { Action, AnyAction } from 'redux';
import { BottomNavigation, BottomNavigationAction } from '@material-ui/core';
import { ConferenceIcon, ProfileIcon, DocIcon } from '../../icons/icons';

type Props = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>

const MobileMenu:React.FC<Props> = ({ tabValue, tabValueAction, contractListOpenAction }) => {
    return (
        <BottomNavigation
            value={tabValue}
            onChange={(event, newValue) => {
                tabValueAction(newValue);
                contractListOpenAction(false);
            }}
            showLabels
            className="mobileMenu">
            <BottomNavigationAction label="Звонок" icon={<ConferenceIcon />} />
            <BottomNavigationAction label="Платежи" icon={<DocIcon />} />
            <BottomNavigationAction label="Профиль" icon={<ProfileIcon />} />
        </BottomNavigation>
    );
}

const mapStateToProps = (state: RootState) => ({
    tabValue: state.registration.tabValue
});

const mapDispatchToProps = (dispatch: Dispatch<Action> & ThunkDispatch<any, any, AnyAction>) => ({
    tabValueAction: (tabValue: number) => dispatch(actions.registration.tabValueAction(tabValue)),
    contractListOpenAction: (contractListOpen: boolean) => dispatch(actions.registration.contractListOpenAction(contractListOpen)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MobileMenu);