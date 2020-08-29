import { InstanceHead } from './InstanceHead';

export class ClientAPI {
    public static async getDepartments(sessionId: string) {
        return await InstanceHead.instance.get(`Client/GetDepartments/${sessionId}`).then(res => {
            return res.data;
        })
    }
    public static async startVideoCallForClient(sessionId: string, departmentId: number) {
        return await InstanceHead.instance.post(`Client/StartVideoCallForClient/${sessionId}/${departmentId}`).then(res => {
            return res.data;
        })
    }
    public static async getVideoCallStatus(sessionId: string, requestId: number) {
        return await InstanceHead.instance.get(`Client/GetVideoCallStatus/${sessionId}/${requestId}`).then(res => {
            return res.data;
        })
    }
    public static async getBankAccounts(sessionId: string, clientAccountId: number) {
        return await InstanceHead.instance.post(`Client/GetBankAccounts/${sessionId}/${clientAccountId}`).then(res => {
            return res.data;
        })
    }
}

export interface IBankAccounts {
    accountType: string,
    accountValue: string,
}