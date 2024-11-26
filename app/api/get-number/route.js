import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
    const filePath = path.join(process.cwd(), 'data', 'phoneNumbersDB.json');

    try {
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const jsonData = JSON.parse(fileContents);

        return NextResponse.json({ phoneNumbers: jsonData.phoneNumbers || [] });
    } catch (error) {
        console.error('Error reading phoneNumbersDB.json:', error.message);
        return NextResponse.json({ error: 'Failed to read the file' }, { status: 500 });
    }
}
