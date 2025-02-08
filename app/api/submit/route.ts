import { NextResponse } from 'next/server';
import { googleSheetsService } from '@/lib/google-sheets';
import { FormData } from '@/lib/types/sheets';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // フォームデータをスプレッドシートの行形式に変換
    const rowData: FormData = {
      lastName: data.lastName,
      firstName: data.firstName,
      lastNameKana: data.lastNameKana,
      firstNameKana: data.firstNameKana,
      birthDate: data.birthDate,
      timing: data.timing,
      jobType: data.jobType,
      prefecture: data.prefecture,
      city: data.city,
      phone: data.phone,
      email: data.email,
    };

    // スプレッドシートに追加
    await googleSheetsService.appendToSheet(rowData);

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