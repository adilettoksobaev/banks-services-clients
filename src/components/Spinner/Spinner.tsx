import React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../store';
import './Spinner.scss';

type Props = ReturnType<typeof mapStateToProps>;

const Spinner:React.FC<Props> = ({ loading }) => {

    if(!loading) return null;

    return (
        <div className="main-preloader">
            <div className="pulse"></div>
        </div>
    );
};

const mapStateToProps = (state: RootState) => ({
    loading: state.registration.loading,
});

export default connect(mapStateToProps)(Spinner);