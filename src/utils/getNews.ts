import { localStorageGetItem } from "../utils/storage";
import { SessionAPI } from '../api/SessionAPI';
import store from "../store";
import * as registration from '../store/Registration/actions';

export class GetNews {
    public static subscribe() {
        const sessionId = localStorageGetItem('sessionId')
        if(sessionId) {
            SessionAPI.getNewsLongPolling(sessionId).then(res => {
                if(res.status === 200) {
                    store.dispatch(registration.newsLongPollingAction(res.data))
                    GetNews.subscribe();
                }
            }).catch(({response}) => GetNews.catchLongPolling(response));
        }
    }

    private static catchLongPolling (response: any) {
        if(response.status === 401) {
            store.dispatch(registration.logoutAction());
        }
        if(response.status === 400)  {
            alert(response.message);
        }
    }
}