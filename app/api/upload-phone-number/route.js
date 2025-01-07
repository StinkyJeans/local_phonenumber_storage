import fs from 'fs';
import path from 'path';

export async function POST(request) {
  try {
    const { phoneNumbers } = await request.json();

    if (!Array.isArray(phoneNumbers)) {
      return new Response(
        JSON.stringify({ message: 'Invalid input data format' }),
        { status: 400 }
      );
    }

    // Path to your phoneNumbersDB.json file
    const filePath = path.join(process.cwd(), 'data', 'phoneNumbersDB.json');

    // Ensure the file exists or create it
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify({ phoneNumbers: [] }, null, 2));
    }

    // Read the existing data
    const fileData = fs.readFileSync(filePath, 'utf-8');
    const jsonData = JSON.parse(fileData);

    if (!jsonData.phoneNumbers) {
      jsonData.phoneNumbers = [];
    }

    // Append new phone numbers, avoiding duplicates
    phoneNumbers.forEach((newPhone) => {
      const exists = jsonData.phoneNumbers.some(
        (existingPhone) => existingPhone.number === newPhone.number
      );
      if (!exists) {
        jsonData.phoneNumbers.push(newPhone);
      }
    });

    // Write updated data back to the file
    fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));

    return new Response(
      JSON.stringify({ message: 'Phone numbers uploaded successfully' }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing phone numbers:', error);
    return new Response(
      JSON.stringify({ message: 'Failed to process phone numbers' }),
      { status: 500 }
    );
  }
}
