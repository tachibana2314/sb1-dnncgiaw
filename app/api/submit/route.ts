import { NextResponse } from 'next/server';
import { googleSheetsService } from '@/lib/google/sheets-service';
import { SESService } from '@/lib/aws/ses-service';
import { FormData } from '@/lib/types/sheets';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // フォームデータをスプレッドシートの行形式に変換
    const rowData: FormData = {
      lastName: data.lastName, // 姓
      firstName: data.firstName, // 名
      lastNameKana: data.lastNameKana, // 姓（かな）
      firstNameKana: data.firstNameKana, // 名（かな）
      birthDate: data.birthDate, // 生年月日
      timing: data.timing, // 転職希望時期
      jobType: data.jobType, // 希望職種
      prefecture: data.prefecture, // 都道府県
      city: data.city, // 市区町村
      phone: data.phone, // 電話番号
      email: data.email, // メールアドレス
    };

    // スプレッドシートに追加
    await googleSheetsService.appendToSheet(rowData);

    // メール送信
    // const fullName = `${data.lastName} ${data.firstName}`;
    // await SESService.sendConfirmationEmail(data.email, fullName);

    return NextResponse.json({ success: true });
  } catch (error) {
    // エラーオブジェクトの詳細情報をログ出力
    console.error('Form submission error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      error: error
    });

    // クライアントへのレスポンスにもエラーメッセージを含める
    const errorMessage = error instanceof Error ? error.message : '不明なエラーが発生しました';
    return NextResponse.json(
      { 
        error: 'Failed to submit form',
        details: errorMessage 
      },
      { status: 500 }
    );
  }
}