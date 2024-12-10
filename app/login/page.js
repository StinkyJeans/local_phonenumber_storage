'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
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
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
            <form onSubmit={handleLogin} className="w-full max-w-xs bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl text-black font-semibold text-center mb-6">Login</h2>
                <div className="mb-4">
                    <label className="text-gray-700 text-sm mb-1">Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username"
                        className="text-black p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring focus:ring-blue-200"
                    />
                </div>
                <div className="mb-4">
                    <label className="text-gray-700 text-sm mb-1">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="text-black p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring focus:ring-blue-200"
                        autoComplete="current-password"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
                    disabled={isLoading}
                >
                    {isLoading ? 'Logging in...' : 'Login'}
                </button>
                {error && <p className="mt-4 text-center text-red-500">{error}</p>}
            </form>
        </div>
    );
}
