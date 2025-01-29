export async function POST(req) {
    const searchParams = new URL(req.url).searchParams;
    const key = searchParams.get("key");
  
    if (!key || key !== "1234") {
      return new Response(JSON.stringify({ error: "Invalid key" }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }
  
    const body = await req.json();
    const { username, password } = body;
    const adminUsername = 'admin';
    const adminPassword = 'password1234';
    const adminName = 'Earls Kainan';
  
  
    console.log('Received credentials:', { username, password });
  
    if (username === adminUsername && password === adminPassword) {
      return new Response(JSON.stringify({ message: 'Login successful', name: adminName }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } else {
      return new Response(JSON.stringify({ message: 'Invalid username or password' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }
  }
  