import { NextResponse } from 'next/server';
import { appendToSheet } from '@/lib/google-sheets';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // フォームデータをスプレッドシートの行形式に変換
    const rowData = [
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
    ];

    // スプレッドシートに追加
    await appendToSheet(rowData);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error submitting form:', error);
    return NextResponse.json(
      { error: 'Failed to submit form' },
      { status: 500 }
    );
  }
}