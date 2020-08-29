import axios, { AxiosInstance } from 'axios';
import { baseUrl, baseUrlRegistration } from '../utils/baseUrl';

export class InstanceHead {
    public static instance: AxiosInstance
    public static init(apiKey: string) {
        InstanceHead.instance = axios.create({
            baseURL: `${baseUrl()}api/`,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "apiKey" : apiKey
            }
        })
    }
}

export class InstanceHeadRegistration {
    public static instance: AxiosInstance
    public static init(apiKey: string) {
        InstanceHeadRegistration.instance = axios.create({
            baseURL: `${baseUrlRegistration()}api/`,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "apiKey" : apiKey,
                "deviceId": "Desktop"
            }
        })
    }
}