'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('/api/login?key=1234', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: username.trim(), password: password.trim() }),
            });

            if (response.ok) {
                const data = await response.json();
                router.push('/numbers'); 
            } else {
                const data = await response.json();
                setError(data.message);
            }
        } catch {
            setError('Login failed. Please try again.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <form onSubmit={handleLogin} className="flex flex-col items-center bg-white p-4 rounded shadow-md">
                <h2 className="text-xl font-bold text-black">Login</h2>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    className="p-2 border border-gray-300 rounded mt-2 text-black"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="p-2 border border-gray-300 rounded mt-2 text-black"
                />
                <button
                    type="submit"
                    className="p-2 mt-4 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Login
                </button>
                {error && <p className="mt-2 text-red-500">{error}</p>}
            </form>
        </div>
    );
}
