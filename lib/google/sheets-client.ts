import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

export const auth = new OAuth2Client({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: process.env.GOOGLE_REDIRECT_URI,
});

// 環境変数のチェックを追加
if (!process.env.GOOGLE_REFRESH_TOKEN) {
    throw new Error('GOOGLE_REFRESH_TOKEN is not set in environment variables');
}

auth.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN
});

export const sheetsClient = google.sheets({ version: 'v4', auth });
 