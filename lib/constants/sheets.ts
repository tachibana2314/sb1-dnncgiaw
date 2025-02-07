export const TIMEZONE_JAPAN = 'Asia/Tokyo';

export const SHEET_HEADERS = [
  '姓',
  '名',
  '姓（かな）',
  '名（かな）',
  '生年月日',
  '転職希望時期ID',
  '転職希望時期',
  '転職希望目標日',
  '希望職種ID',
  '希望職種',
  '職種カテゴリ',
  '都道府県',
  '市区町村',
  '電話番号',
  'メールアドレス',
  '登録時間'
];

export const timingMap: Record<string, { id: number; value: string }> = {
  'asap': { id: 1, value: 'なるべく早く' },
  '1month': { id: 2, value: '1ヶ月以内' },
  '3months': { id: 3, value: '3ヶ月以内' },
  '6months': { id: 4, value: '6ヶ月以内' },
  '1year': { id: 5, value: '1年以内' },
};

export const jobTypeMap: Record<string, { id: number; value: string; category: number | null }> = {
  'truck': { id: 101, value: 'トラックドライバー', category: 1 },
  'taxi': { id: 102, value: 'タクシードライバー', category: 1 },
  'bus': { id: 103, value: 'バスドライバー', category: 1 },
  'waste': { id: 104, value: '廃棄物収集運搬ドライバー', category: 1 },
  'sales': { id: 105, value: 'ルート営業', category: 1 },
  'manager': { id: 106, value: '運行管理者', category: 1 },
  'other': { id: 9999, value: 'その他', category: null },
}; 