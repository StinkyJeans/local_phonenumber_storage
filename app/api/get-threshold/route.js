import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const filePath = path.join(process.cwd(), 'data', 'thresholdDB.json');

  try {
    const fileContents = await fs.promises.readFile(filePath, 'utf8');
    const thresholdData = JSON.parse(fileContents);

    return NextResponse.json({ threshold: thresholdData.threshold });
  } catch (error) {
    console.error('Error reading thresholdDB.json:', error.message);
    return NextResponse.json({ error: 'Failed to read the file' }, { status: 500 });
  }
}
