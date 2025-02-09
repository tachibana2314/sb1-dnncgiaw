import { TIMEZONE_JAPAN, SHEET_HEADERS, timingMap, jobTypeMap } from '../constants/sheets';
import { FormData } from '../types/sheets';
import { cryptoService } from '../utils/crypto';
import { sheetsClient } from './sheets-client';

class GoogleSheetsService {
  private spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID!;

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
    await sheetsClient.spreadsheets.values.clear({
      spreadsheetId: this.spreadsheetId,
      range,
    });

    await sheetsClient.spreadsheets.values.update({
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
    // 転職希望時期
    const timingInfo = timingMap[formData.timing] || { id: null, value: formData.timing };
    // 転職希望時期のターゲット日
    const targetDate = this.calculateTargetDate(formData.timing, registrationDate);
    // 希望職種
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
      // 保存するデータを作成
      const rowData = this.prepareRowData(formData);
      // 保存処理
      const response = await sheetsClient.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: 'Sheet1!A:P',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [rowData],
        },
      });

      return response.data;
    } catch (error) {
      const encryptedFormData = cryptoService.encrypt(JSON.stringify(formData));
      // エラーオブジェクトの詳細情報を出力
      console.error('submitエラー:', {
        message: error instanceof Error ? error.message : '不明なエラー',
        errorObject: error,
        encryptedFormData: encryptedFormData,
        timestamp: new Date().toISOString()
      });
    }
  }
}

export const googleSheetsService = new GoogleSheetsService();
