import { ConfigService } from "@nestjs/config"

const configService = new ConfigService();

const apiUrl = configService.get<string>('API_URL')

export const API_GATEWAY = {
    apiUrl: apiUrl
}

export const headers = {
    "Access-Control-Allow-Origin": "https://deploy-app.d1rj0t7hhoxt1n.amplifyapp.com",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
    // "Authorization": 'Bearer ' + localStorage.getItem('token')
    // 'Content-Type': 'application/json',
}
