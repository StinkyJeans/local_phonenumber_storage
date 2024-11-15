import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'phoneNumbersDB.json');

export async function GET(req) {
    try {
        const data = await fs.promises.readFile(filePath, 'utf8');
        const phoneNumbers = JSON.parse(data);

        return new Response(JSON.stringify(phoneNumbers), { status: 200 });
    } catch (error) {
        console.error('Error retrieving phone numbers:', error);
        return new Response(JSON.stringify({ message: 'Error retrieving numbers' }), { status: 500 });
    }
}
