export interface TimingInfo {
  id: number;
  value: string;
}

export interface JobTypeInfo {
  id: number;
  value: string;
  category: number | null;
}

export interface FormData {
  firstName: string; // 名
  lastName: string; // 姓
  firstNameKana: string; // 名（かな）
  lastNameKana: string; // 姓（かな）
  birthDate: string; // 生年月日
  timing: string; // 転職希望時期
  jobType: string; // 希望職種
  prefecture: string; // 都道府県
  city: string; // 市区町村
  phone: string; // 電話番号
  email: string; // メールアドレス
} 