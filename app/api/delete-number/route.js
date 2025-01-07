import fs from 'fs';
import path from 'path';

export async function DELETE(req) {
    try {
        const { number } = await req.json();

        if (!number || typeof number !== 'string') {
            return new Response(JSON.stringify({ message: 'Invalid number' }), { status: 400 });
        }

        const filePath = path.join(process.cwd(), 'data', 'phoneNumbersDB.json');
        const archivedFilePath = path.join(process.cwd(), 'data', 'archivedPhoneNumberDB.json');
        const data = await fs.promises.readFile(filePath, 'utf8');
        const jsonData = JSON.parse(data);

        if (!Array.isArray(jsonData.phoneNumbers)) {
            jsonData.phoneNumbers = [];
        }
        const phoneIndex = jsonData.phoneNumbers.findIndex(phone => phone.number === number);
        if (phoneIndex === -1) {
            return new Response(JSON.stringify({ message: 'Phone number not found' }), { status: 404 });
        }

        const archivedData = await fs.promises.readFile(archivedFilePath, 'utf8');
        const archivedJsonData = JSON.parse(archivedData) || { phoneNumbers: [] };
        archivedJsonData.phoneNumbers.push(jsonData.phoneNumbers[phoneIndex]);
        jsonData.phoneNumbers.splice(phoneIndex, 1);


        await fs.promises.writeFile(filePath, JSON.stringify(jsonData, null, 2));

        await fs.promises.writeFile(archivedFilePath, JSON.stringify(archivedJsonData, null, 2));

        return new Response(JSON.stringify({ phoneNumbers: jsonData.phoneNumbers }), { status: 200 });
    } catch (error) {
        console.error('Error archiving phone number:', error);
        return new Response(JSON.stringify({ message: 'Error archiving phone number' }), { status: 500 });
    }
}
