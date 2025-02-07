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
    console.error('Error submitting form:', error);
    return NextResponse.json(
      { error: 'Failed to submit form' },
      { status: 500 }
    );
  }
}