// app/api/set-threshold/route.js
import fs from 'fs';
import path from 'path';

export async function POST(req) {
  try {
    const { threshold } = await req.json();

    if (!threshold || isNaN(threshold)) {
      return new Response(JSON.stringify({ error: 'Invalid threshold value' }), { status: 400 });
    }

    const filePath = path.join(process.cwd(), 'data', 'thresholdDB.json');

    const currentData = await fs.promises.readFile(filePath, 'utf8');
    const jsonData = JSON.parse(currentData);


    jsonData.threshold = Number(threshold);


    await fs.promises.writeFile(filePath, JSON.stringify(jsonData, null, 2));

    return new Response(JSON.stringify({ threshold: jsonData.threshold }), { status: 200 });
  } catch (error) {
    console.error('Error setting threshold:', error);
    return new Response(JSON.stringify({ error: 'Failed to update threshold' }), { status: 500 });
  }
}
