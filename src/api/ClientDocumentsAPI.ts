import { InstanceHead } from './InstanceHead';

export class ClientDocumentsAPI {
    public static async getPaymentOrders(sessionId: string, clientAccountId: number) {
        return await InstanceHead.instance.get(`ClientDocuments/GetPaymentOrders/${sessionId}/${clientAccountId}`).then(res => {
            return res.data;
        })
    }
    public static async addPaymentOrder(sessionId: string, clientAccountId: number, paymentOrder: IAddPaymentOrder) {
        return await InstanceHead.instance.post(`ClientDocuments/AddPaymentOrder/${sessionId}/${clientAccountId}`, paymentOrder).then(res => {
            return res.data;
        })
    }
    public static async signDocument(sessionId: string, documentId: string) {
        return await InstanceHead.instance.post(`ClientDocuments/SignDocument/${sessionId}/${documentId}`).then(res => {
            return res.data;
        })
    }
    public static async refuseDocument(sessionId: string, documentId: string) {
        return await InstanceHead.instance.post(`ClientDocuments/RefuseDocument/${sessionId}/${documentId}`).then(res => {
            return res.data;
        })
    }
    public static async getContracts(sessionId: string, clientAccountId: number) {
        return await InstanceHead.instance.get(`ClientDocuments/GetContracts/${sessionId}/${clientAccountId}`).then(res => {
            return res.data;
        })
    }
    public static async getContract(sessionId: string, documentId: string, apiKey: string) {
        return await InstanceHead.instance.get(`ClientDocuments/GetContract/${sessionId}/${documentId}/${apiKey}`).then(res => {
            return res.data;
        })
    }
}

export interface IAddPaymentOrder {
    paymentOrderNumber: string,
    description: string,
    date: Date,
    payer: {
        accountOfBank: string,
        calculationScheme: string
    },
    paymentRecipient: {
        name: string,
        bank: string,
        bik: string,
        paymentAccount: string,
        target: string,
        paymentCode: string,
        amount: number,
        currency: string,
    }
}

export interface IPaymentOrders {
    documentId: string,
    createdDate: Date,
    userAccountId: number,
    documentStatus: DocumentStatus,
    document: {
        date: Date,
        payer: {
            accountOfBank: string,
            calculationScheme: string,
        },
        paymentRecipient: {
            name: string,
            bank: string,
            bik: string,
            paymentAccount: string,
            target: string,
            paymentCode: string,
            amount: number,
            currency: string,
        }
    }
}
export interface IContract {
    documentId: string,
    documentType: DocumentTypes,
    createdDate: Date,
    userAccountId: 0,
    documentStatus: DocumentStatus,
    documentDescription: string,
}

export enum DocumentTypes {
    PaymentOrder = "PaymentOrder",
    ClientContract = "ClientContract",
}

export enum DocumentStatus {
    New = "New", 
    Signed = "Signed",
    Refused = "Refused",
}