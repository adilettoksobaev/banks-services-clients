import { InstanceHead } from './InstanceHead';

export class ModerationAPI {
    public static async startVideoCallForGuest(userName: string) {
        return await InstanceHead.instance.post('Moderation/StartVideoCallForGuest', {userName}).then(res => {
            return res.data;
        })
    }
}