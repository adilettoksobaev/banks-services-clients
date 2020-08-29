import React, { Dispatch } from 'react';
import { connect } from 'react-redux';
import { RootState, actions } from '../../store';
import { ThunkDispatch } from 'redux-thunk';
import { Action, AnyAction } from 'redux';
import { SolveCameraIcon, SolveMicrofonIcon } from '../../icons/icons';
import { Button } from '@material-ui/core';
import Countdown, { CountdownRenderProps } from 'react-countdown-now';

type Props = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>;

const Solve:React.FC<Props> = ({ solveAction }) => {
    const renderer = (props: CountdownRenderProps) => {
        const { seconds, completed } = props;
        if (completed) {
          return (
            <div className="solve">
                <div className="solve__content">
                    <h2>Внимание!</h2>
                    <p>Уважаемый клиент,</p>
                    <p>Система запросит у Вас разрешение на доступ к <br /> камере и микрофону.</p>
                    <div className="solve__row">
                        <div className="solve__icon"><SolveCameraIcon /></div>
                        <div className="solve__icon"><SolveMicrofonIcon /></div>
                    </div>
                    <p className="bold">Обязательно нажмите кнопку “Разрешить”</p>
                </div>
                <div className="solve__btn">
                    <Button onClick={() => solveAction(true)} fullWidth variant="contained" color="primary" disableElevation>Понятно</Button>
                </div>
            </div>
          )
        } else {
          return (
            <div className="solve">
                <div className="solve__content">
                    <h2>Внимание!</h2>
                    <p>Уважаемый клиент,</p>
                    <p>Система запросит у Вас разрешение на доступ к <br /> камере и микрофону.</p>
                    <div className="solve__row">
                        <div className="solve__icon"><SolveCameraIcon /></div>
                        <div className="solve__icon"><SolveMicrofonIcon /></div>
                    </div>
                    <p className="bold">Обязательно нажмите кнопку “Разрешить”</p>
                </div>
                <div className="solve__btn">
                    <Button onClick={() => solveAction(true)} fullWidth variant="contained" color="primary" disabled disableElevation>Понятно ({seconds})</Button>
                </div>
            </div>
          )
        }
    };

    return (
        <Countdown
            date={Date.now() + 5000}
            renderer={renderer}
        />
    );
}

const mapStateToProps = (state: RootState) => ({
    settings: state.registration.settings
});

const mapDispatchToProps = (dispatch: Dispatch<Action> & ThunkDispatch<any, any, AnyAction>) => ({
    solveAction: (solve: boolean) => dispatch(actions.registration.solveAction(solve)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Solve);