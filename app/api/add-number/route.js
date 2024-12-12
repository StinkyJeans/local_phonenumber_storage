import fs from 'fs';
import path from 'path';

export async function POST(req) {
    try {
        const { number, name, role } = await req.json();

        if (!number || typeof number !== 'string' || !name || typeof name !== 'string' || !role || typeof role !== 'string') {
            return new Response(JSON.stringify({ message: 'Invalid input' }), { status: 400 });
        }

        const filePath = path.join(process.cwd(), 'data', 'phoneNumbersDB.json');

        const data = await fs.promises.readFile(filePath, 'utf8');
        const jsonData = JSON.parse(data);

        if (!Array.isArray(jsonData.phoneNumbers)) {
            jsonData.phoneNumbers = [];
        }

        jsonData.phoneNumbers.push({ number, name, role });

        await fs.promises.writeFile(filePath, JSON.stringify(jsonData, null, 2));

        return new Response(JSON.stringify({ phoneNumbers: jsonData.phoneNumbers }), { status: 200 });
    } catch (error) {
        console.error('Error adding number:', error);
        return new Response(JSON.stringify({ message: 'Error writing file' }), { status: 500 });
    }
}
