import { NextResponse } from 'next/server';
import twilio from 'twilio';
import path from 'path';
import fs from 'fs/promises';

export async function POST(req) {
  try {
    const { message } = await req.json();
    if (!message) {
      return NextResponse.json({ success: false, error: "Message content is required." }, { status: 400 });
    }

  
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
    if (!accountSid || !authToken || !fromPhoneNumber) {
      return NextResponse.json({ success: false, error: "Twilio credentials are missing." }, { status: 500 });
    }

    const client = twilio(accountSid, authToken);

   
    const filePath = path.resolve(process.cwd(), 'data', 'phoneNumbersDB.json');
    const fileData = await fs.readFile(filePath, 'utf-8');
    const { phoneNumbers } = JSON.parse(fileData);

    if (!Array.isArray(phoneNumbers) || phoneNumbers.length === 0) {
      return NextResponse.json({ success: false, error: "No phone numbers found in the database." }, { status: 400 });
    }

    const results = await Promise.all(
      phoneNumbers.map(async (phoneNumber) => {
        try {
          const response = await client.messages.create({
            body: message,
            from: fromPhoneNumber,
            to: phoneNumber,
          });
          return { phoneNumber, sid: response.sid, status: "success" };
        } catch (error) {
          return { phoneNumber, error: error.message, status: "failed" };
        }
      })
    );


    const success = results.filter((result) => result.status === "success");
    const failed = results.filter((result) => result.status === "failed");

    return NextResponse.json({ success: true, sent: success, failed });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
