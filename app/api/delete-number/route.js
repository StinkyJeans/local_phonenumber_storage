import fs from 'fs';
import path from 'path';

export async function DELETE(req) {
    try {
        const { number } = await req.json();

        if (!number || typeof number !== 'string') {
            return new Response(JSON.stringify({ message: 'Invalid number' }), { status: 400 });
        }

        const filePath = path.join(process.cwd(), 'data', 'phoneNumbersDB.json');

        const data = await fs.promises.readFile(filePath, 'utf8');
        const jsonData = JSON.parse(data);

        if (!Array.isArray(jsonData.phoneNumbers)) {
            jsonData.phoneNumbers = [];
        }

        jsonData.phoneNumbers = jsonData.phoneNumbers.filter(phone => phone.number !== number);

        await fs.promises.writeFile(filePath, JSON.stringify(jsonData, null, 2));

        return new Response(JSON.stringify({ phoneNumbers: jsonData.phoneNumbers }), { status: 200 });
    } catch (error) {
        console.error('Error deleting number:', error);
        return new Response(JSON.stringify({ message: 'Error deleting number' }), { status: 500 });
    }
}
