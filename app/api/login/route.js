// app/api/login.js

export async function POST(req) {
    // Check for the presence of the key in the query parameters
    const searchParams = new URL(req.url).searchParams;
    const key = searchParams.get("key");

    // Validate the key
    if (!key || key !== "1234") {
        return new Response(JSON.stringify({ error: "Invalid key" }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    // Extract the body from the request
    const body = await req.json();
    const { username, password } = body;

    // Hardcoded admin credentials
    const adminUsername = 'admin';
    const adminPassword = 'password1234';
    const adminName = 'Earls Kainan'; // Customize the admin name here

    // Debugging logs
    console.log('Received credentials:', { username, password });

    // Check credentials
    if (username === adminUsername && password === adminPassword) {
        return new Response(JSON.stringify({ message: 'Login successful', name: adminName }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } else {
        return new Response(JSON.stringify({ message: 'Invalid username or password' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }
}
