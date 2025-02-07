import * as z from "zod";

export const jobApplicationSchema = z.object({
  lastName: z.string().min(1, "姓を入力してください"),
  firstName: z.string().min(1, "名を入力してください"),
  lastNameKana: z.string().min(1, "姓（かな）を入力してください").regex(/^[ぁ-んー]+$/, "ひらがなで入力してください"),
  firstNameKana: z.string().min(1, "名（かな）を入力してください").regex(/^[ぁ-んー]+$/, "ひらがなで入力してください"),
  birthDate: z.string()
    .min(1, "生年月日を入力してください")
    .regex(/^\d{8}$/, "生年月日は8桁の数字で入力してください")
    .refine((val) => {
      if (!/^\d{8}$/.test(val)) return false;
      
      const year = parseInt(val.substring(0, 4), 10);
      const month = parseInt(val.substring(4, 6), 10);
      const day = parseInt(val.substring(6, 8), 10);
      
      // 月と日の基本的なバリデーション
      if (month < 1 || month > 12) return false;
      if (day < 1) return false;

      // 月ごとの日数チェック
      const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      
      // 閏年の判定
      const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
      if (isLeapYear) {
        monthDays[1] = 29; // 閏年の2月は29日
      }

      if (day > monthDays[month - 1]) return false;
      
      const date = new Date(year, month - 1, day);
      const currentDate = new Date();
      
      return date instanceof Date && !isNaN(date.getTime()) && // 有効な日付かチェック
             date <= currentDate && // 未来の日付でないことをチェック
             year >= 1900; // 1900年以降の日付であることをチェック
    }, "有効な生年月日を入力してください"),
  timing: z.string({
    required_error: "転職希望時期を選択してください",
  }).refine((val) => {
    const validTimings = ["asap", "1month", "3months", "6months", "1year"];
    return validTimings.includes(val);
  }, "有効な転職希望時期を選択してください"),
  jobType: z.string({
    required_error: "希望職種を選択してください",
  }).refine((val) => {
    const validJobTypes = ["truck", "bus", "taxi", "waste", "sales", "manager", "other"];
    return validJobTypes.includes(val);
  }, "有効な希望職種を選択してください"),
  prefecture: z.string({
    required_error: "都道府県を選択してください",
  }).min(1, "都道府県を選択してください")
    .refine((val) => val !== "都道府県", "都道府県を選択してください"),
  city: z.string()
    .min(1, "市区町村を選択してください")
    .refine((val) => val !== "市区町村", "市区町村を選択してください"),
  phone: z.string()
    .min(1, "電話番号を入力してください")
    .regex(/^[0-9]+$/, "数字のみで入力してください")
    .refine((val) => {
      const digits = val.replace(/[^\d]/g, '');
      return digits.length >= 10 && digits.length <= 11;
    }, "電話番号は10桁または11桁で入力してください"),
  email: z.string()
    .min(1, "メールアドレスを入力してください")
    .email("正しいメールアドレスを入力してください"),
});