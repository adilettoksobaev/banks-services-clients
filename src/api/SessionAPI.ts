import { InstanceHead } from './InstanceHead';

export class SessionAPI {
    public static async checkSession(sessionId: string) {
        return await InstanceHead.instance.get(`Session/CheckSession/${sessionId}`)
    }
    public static async getUserInfo(sessionId: string) {
        return await InstanceHead.instance.get(`Session/GetUserInfo/${sessionId}`).then(res => {
            return res.data;
        })
    }
    public static async closeSession(sessionId: string) {
        return await InstanceHead.instance.post(`Session/CloseSession/${sessionId}`).then(res => {
            return res.data;
        })
    }
    public static async getNewsLongPolling(sessionId: string) {
        return await InstanceHead.instance.get(`Session/GetNewsLongPolling/${sessionId}`)
    }
}

export interface IUserInfo {
    inn: string,
    fullName: string,
    userId: number,
}