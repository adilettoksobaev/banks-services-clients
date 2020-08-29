import React from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { Route, Switch, withRouter } from 'react-router-dom'
import './App.scss';
import AppStack from '../AppStack/AppStack'; // choose your lib
import { Provider } from 'react-redux';
import store from '../../store';

const theme = createMuiTheme({
    typography: {
      fontFamily: 'Open Sans, sans-serif',
    },
    palette: {
      primary: { main: '#007AFF', contrastText: '#fff' }
    }
});

function App() {
    return (
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <Switch>
                    <Route path="/" component={AppStack} />
                </Switch>
            </ThemeProvider>
        </Provider>
    );
}

export default withRouter(App);