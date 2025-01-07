import fs from 'fs';
import path from 'path';

export async function POST(req) {
  try {
    const { number, name, role } = await req.json();
    console.log('Received data:', { number, name, role });

    if (!number || typeof number !== 'string' || !name || typeof name !== 'string' || !role || typeof role !== 'string') {
      return new Response(JSON.stringify({ message: 'Invalid input' }), { status: 400 });
    }
    const archivedFilePath = path.join(process.cwd(), 'data', 'archivedPhoneNumberDB.json');
    const phoneNumbersFilePath = path.join(process.cwd(), 'data', 'phoneNumbersDB.json');
    const archivedData = await fs.promises.readFile(archivedFilePath, 'utf8');
    const archivedJsonData = JSON.parse(archivedData);


    const archivedPhoneIndex = archivedJsonData.phoneNumbers.findIndex((phone) => phone.number === number);
    
    if (archivedPhoneIndex === -1) {
      return new Response(JSON.stringify({ message: 'Phone number not found in archive' }), { status: 404 });
    }


    archivedJsonData.phoneNumbers.splice(archivedPhoneIndex, 1);
    await fs.promises.writeFile(archivedFilePath, JSON.stringify(archivedJsonData, null, 2));

    const phoneNumbersData = await fs.promises.readFile(phoneNumbersFilePath, 'utf8');
    const phoneNumbersJsonData = JSON.parse(phoneNumbersData);

    if (!phoneNumbersJsonData.phoneNumbers) {
      phoneNumbersJsonData.phoneNumbers = [];
    }

    phoneNumbersJsonData.phoneNumbers.push({ number, name, role });

    await fs.promises.writeFile(phoneNumbersFilePath, JSON.stringify(phoneNumbersJsonData, null, 2));

    return new Response(JSON.stringify({ phoneNumbers: phoneNumbersJsonData.phoneNumbers }), { status: 200 });
  } catch (error) {
    console.error('Error restoring phone number:', error);
    return new Response(JSON.stringify({ message: 'Failed to restore phone number' }), { status: 500 });
  }
}
