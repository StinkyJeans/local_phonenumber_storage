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
        const phoneNumbers = JSON.parse(data);

        const updatedNumbers = phoneNumbers.filter(n => n !== number);

        await fs.promises.writeFile(filePath, JSON.stringify(updatedNumbers, null, 2));

        return new Response(JSON.stringify({ message: 'Number deleted successfully' }), { status: 200 });
    } catch (error) {
        console.error('Error deleting number:', error);
        return new Response(JSON.stringify({ message: 'Error deleting number' }), { status: 500 });
    }
}
