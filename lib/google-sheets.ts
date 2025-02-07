import { google } from 'googleapis';

// Google Sheets APIの設定
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

// 転職希望時期の計算
function calculateTargetDate(timing: string, registrationDate: Date): Date {
  const date = new Date(registrationDate);
  switch (timing) {
    case 'asap':
      return date;
    case '1month':
      date.setDate(date.getDate() + 30);
      return date;
    case '3months':
      date.setDate(date.getDate() + 90);
      return date;
    case '6months':
      date.setMonth(date.getMonth() + 6);
      return date;
    case '1year':
      date.setFullYear(date.getFullYear() + 1);
      return date;
    default:
      return date;
  }
}

// 転職希望時期のマッピング
const timingMap: Record<string, { id: number; value: string }> = {
  'asap': { id: 1, value: 'なるべく早く' },
  '1month': { id: 2, value: '1ヶ月以内' },
  '3months': { id: 3, value: '3ヶ月以内' },
  '6months': { id: 4, value: '6ヶ月以内' },
  '1year': { id: 5, value: '1年以内' },
};

// 希望職種のマッピング
const jobTypeMap: Record<string, { id: number; value: string; category: number | null }> = {
  'truck': { id: 101, value: 'トラックドライバー', category: 1 },
  'taxi': { id: 102, value: 'タクシードライバー', category: 1 },
  'bus': { id: 103, value: 'バスドライバー', category: 1 },
  'waste': { id: 104, value: '廃棄物収集運搬ドライバー', category: 1 },
  'sales': { id: 105, value: 'ルート営業', category: 1 },
  'manager': { id: 106, value: '運行管理者', category: 1 },
  'other': { id: 9999, value: 'その他', category: null },
};

export async function appendToSheet(values: any[]) {
  try {
    const registrationDate = new Date();
    const timing = values[5] as string; // timingの値を取得
    const jobType = values[6] as string; // jobTypeの値を取得

    // 転職希望時期の情報を取得
    const timingInfo = timingMap[timing] || { id: null, value: timing };
    const targetDate = calculateTargetDate(timing, registrationDate);

    // 希望職種の情報を取得
    const jobTypeInfo = jobTypeMap[jobType] || { id: 9999, value: jobType, category: null };

    // スプレッドシートに書き込むデータを整形
    const rowData = [
      ...values.slice(0, 5), // 姓、名、姓（かな）、名（かな）、生年月日
      registrationDate.toISOString(), // 登録時間
      timingInfo.id, // 転職希望時期ID
      timingInfo.value, // 転職希望時期の表示値
      targetDate.toISOString(), // 転職希望時期の目標日
      jobTypeInfo.id, // 希望職種ID
      jobTypeInfo.value, // 希望職種の表示値
      jobTypeInfo.category, // 希望職種カテゴリ
      ...values.slice(7), // 都道府県以降の情報
    ];

    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    const range = 'Sheet1!A:O'; // 列を増やしたので範囲を更新

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [rowData],
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error appending to sheet:', error);
    throw error;
  }
}