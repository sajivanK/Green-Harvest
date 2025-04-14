import { GoogleAuth } from 'google-auth-library';
import dotenv from 'dotenv';

dotenv.config();

export const getAccessToken = async () => {
    try {
        const auth = new GoogleAuth({
            keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS, 
            scopes: ['https://www.googleapis.com/auth/cloud-platform'], 
        });

        const client = await auth.getClient();
        const tokenResponse = await client.getAccessToken();
        return tokenResponse.token;
    } catch (error) {
        console.error("⚠️ Error getting OAuth token:", error);
        return null; 
    }
};
