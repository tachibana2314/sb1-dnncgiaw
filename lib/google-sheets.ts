import { google } from 'googleapis';
import { TIMEZONE_JAPAN, SHEET_HEADERS, timingMap, jobTypeMap } from './constants/sheets';
import { FormData, TimingInfo, JobTypeInfo } from './types/sheets';

class GoogleSheetsService {
  private sheets;
  private spreadsheetId: string;

  constructor() {
    const auth = new google.auth.OAuth2(
      process.env.GOOGLE_OAUTH_CLIENT_ID,
      process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      process.env.GOOGLE_OAUTH_REDIRECT_URI
    );

    auth.setCredentials({
      access_token: process.env.GOOGLE_OAUTH_ACCESS_TOKEN,
      refresh_token: process.env.GOOGLE_OAUTH_REFRESH_TOKEN,
      scope: 'https://www.googleapis.com/auth/spreadsheets',
      token_type: 'Bearer',
    });

    this.sheets = google.sheets({ version: 'v4', auth });
    this.spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID!;
  }

  private calculateTargetDate(timing: string, registrationDate: Date): Date {
    const date = new Date(registrationDate);
    switch (timing) {
      case 'asap': return date;
      case '1month': return new Date(date.setDate(date.getDate() + 30));
      case '3months': return new Date(date.setDate(date.getDate() + 90));
      case '6months': return new Date(date.setMonth(date.getMonth() + 6));
      case '1year': return new Date(date.setFullYear(date.getFullYear() + 1));
      default: return date;
    }
  }

  private formatDateTime(date: Date): string {
    return date.toLocaleString('ja-JP', {
      timeZone: TIMEZONE_JAPAN,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).replace(/\//g, '-');
  }

  private formatDate(date: Date): string {
    return date.toLocaleString('ja-JP', {
      timeZone: TIMEZONE_JAPAN,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\//g, '-');
  }

  private async initializeSheet(): Promise<void> {
    const range = 'Sheet1!A:P';
    await this.sheets.spreadsheets.values.clear({
      spreadsheetId: this.spreadsheetId,
      range,
    });

    await this.sheets.spreadsheets.values.update({
      spreadsheetId: this.spreadsheetId,
      range: 'Sheet1!A1:P1',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [SHEET_HEADERS],
      },
    });
  }

  private prepareRowData(formData: FormData): any[] {
    const registrationDate = new Date();
    const birthDate = formData.birthDate;
    const timingInfo = timingMap[formData.timing] || { id: null, value: formData.timing };
    const targetDate = this.calculateTargetDate(formData.timing, registrationDate);
    const jobTypeInfo = jobTypeMap[formData.jobType] || { id: 9999, value: formData.jobType, category: null };

    return [
      formData.lastName,
      formData.firstName,
      formData.lastNameKana,
      formData.firstNameKana,
      birthDate,
      timingInfo.id,
      timingInfo.value,
      this.formatDate(targetDate),
      jobTypeInfo.id,
      jobTypeInfo.value,
      jobTypeInfo.category,
      formData.prefecture,
      formData.city,
      formData.phone,
      formData.email,
      this.formatDateTime(registrationDate),
    ];
  }

  public async appendToSheet(formData: FormData): Promise<any> {
    try {
      const rowData = this.prepareRowData(formData);
      const response = await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: 'Sheet1!A:P',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [rowData],
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error appending to sheet:', error);
      throw new Error('スプレッドシートへのデータ追加に失敗しました');
    }
  }
}

export const googleSheetsService = new GoogleSheetsService();
