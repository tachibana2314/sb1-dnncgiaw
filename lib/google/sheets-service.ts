import { sheetsClient } from './sheets-client';
import { FormData } from '@/lib/types/sheets';

export class GoogleSheetsService {
  private static readonly SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID!;
  private static readonly RANGE = 'Sheet1!A:K'; // 保存範囲を適切に設定

  static async appendToSheet(data: FormData) {
    try {
      const values = [
        [
          data.lastName,
          data.firstName,
          data.lastNameKana,
          data.firstNameKana,
          data.birthDate,
          data.timing,
          data.jobType,
          data.prefecture,
          data.city,
          data.phone,
          data.email,
        ],
      ];

      const response = await sheetsClient.spreadsheets.values.append({
        spreadsheetId: this.SPREADSHEET_ID,
        range: this.RANGE,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values,
        },
      });

      console.log('Data appended successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to append to sheet:', error);
      throw error;
    }
  }
} 