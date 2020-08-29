import { IConfirmUser } from '../store/Registration/types';
import { InstanceHeadRegistration } from './InstanceHead';

export class RegistrationAPI {
    public static async startRegistration(phone: string) {
        return await InstanceHeadRegistration.instance.post(`Registration/StartRegistration/${phone}`).then(res => {
            return res.data;
        })
    }
    public static async checkSmsCode(sessionId: string, code: string) {
        return await InstanceHeadRegistration.instance.post(`Registration/CheckSmsCode/${sessionId}/${code}`).then(res => {
            return res.data;
        })
    }
    public static async uploadUserPhoto(sessionId: string, file: FormData) {
        return InstanceHeadRegistration.instance.post(`Registration/UploadUserPhoto/${sessionId}`, file).then(res => {
            return res.data;
        })
    }
    public static async uploadPassportFront(sessionId: string, passportVersion: 'new' | 'old', file: FormData) {
        return InstanceHeadRegistration.instance.post(`Registration/UploadPassportFront/${sessionId}/${passportVersion}`, file).then(res => {
            return res.data;
        })
    }
    public static async uploadPassportBack(sessionId: string, passportVersion: 'new' | 'old', file: FormData) {
        return InstanceHeadRegistration.instance.post(`Registration/UploadPassportBack/${sessionId}/${passportVersion}`, file).then(res => {
            return res.data;
        })
    }
    public static async confirmUserRegistrationInfo(sessionId: string, confirmUser: IConfirmUser) {
        return InstanceHeadRegistration.instance.post(`Registration/ConfirmUserRegistrationInfo/${sessionId}`, confirmUser).then(res => {
            return res.data;
        })
    }
    public static async getVideoModerationSchedule(sessionId: string) {
        return InstanceHeadRegistration.instance.get(`Registration/GetVideoModerationSchedule/${sessionId}`).then(res => {
            return res.data;
        })
    }
    public static async startVideoModeration(sessionId: string) {
        return InstanceHeadRegistration.instance.post(`Registration/StartVideoModeration/${sessionId}`).then(res => {
            return res.data;
        })
    }
    public static async getRegistrationStatus(sessionId: string) {
        return InstanceHeadRegistration.instance.get(`Registration/GetRegistrationStatus/${sessionId}`).then(res => {
            return res.data;
        })
    }
    public static async getVideoModerationStatus(sessionId: string, requestId: number) {
        return InstanceHeadRegistration.instance.get(`Registration/GetVideoModerationStatus/${sessionId}/${requestId}`).then(res => {
            return res.data;
        })
    }
    public static async getUserRegistrationInfo(sessionId: string) {
        return InstanceHeadRegistration.instance.get(`Registration/GetUserRegistrationInfo/${sessionId}`).then(res => {
            return res.data;
        })
    }
}