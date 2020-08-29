import { InstanceHead } from './InstanceHead';
const app = window.location.hostname;

export class AuthAPI {
    public static async authByPhone(phone: string) {
        return await InstanceHead.instance.post(`Auth/AuthByPhone/${phone}`).then(res => {
            return res.data;
        })
    }
    public static async phonePinConfirm(pin: string, phone: string) {
        return await InstanceHead.instance.post('Auth/PhonePinConfirm', {pin, phone, app}).then(res => {
            return res.data;
        })
    }
}