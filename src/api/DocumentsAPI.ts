import { InstanceHeadRegistration } from './InstanceHead';

export class DocumentsAPI {
    public static async getDocumentsForCompletingRegistration(sessionId: string) {
        return await InstanceHeadRegistration.instance.get(`Documents/GetDocumentsForCompletingRegistration/${sessionId}`).then(res => {
            return res.data;
        })
    }
    public static async getDocument(sessionId: string, documentType: string) {
        return await InstanceHeadRegistration.instance.get(`Documents/GetDocument/${sessionId}/${documentType}/142CF319-BD63-4B4C-A4E3-28F2430E477B`).then(res => {
            return res.data;
        })
    }
}