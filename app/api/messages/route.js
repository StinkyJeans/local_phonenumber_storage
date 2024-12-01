import { NextResponse } from 'next/server';
import { getMessageLogs } from '../../../twilioService';

export async function GET() {
  try {
    const messages = await getMessageLogs();
    return NextResponse.json({ messages });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch message logs' }, { status: 500 });
  }
}
