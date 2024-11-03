'use client'; // Ensure this is a client component
import { useState, useEffect } from 'react';

// Phone numbers management component
const PhoneNumbers = ({ onLogout, adminName }) => {
    const [phoneNumbers, setPhoneNumbers] = useState([]);
    const [newPhoneNumber, setNewPhoneNumber] = useState('');
    const [error, setError] = useState('');

    // Load existing phone numbers from the API
    useEffect(() => {
        const fetchPhoneNumbers = async () => {
            const response = await fetch('/api/get-number');
            if (response.ok) {
                const data = await response.json();
                setPhoneNumbers(data);
            } else {
                setError('Failed to fetch phone numbers');
            }
        };

        fetchPhoneNumbers();
    }, []);

    // Add a new phone number
    const addPhoneNumber = async () => {
        if (newPhoneNumber.trim()) {
            const response = await fetch('/api/add-number', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ number: newPhoneNumber }),
            });

            if (response.ok) {
                const updatedNumbers = [...phoneNumbers, newPhoneNumber];
                setPhoneNumbers(updatedNumbers);
                setNewPhoneNumber(''); // Clear input field
            } else {
                const data = await response.json();
                setError(data.message); // Display error message
            }
        } else {
            setError('Phone number cannot be empty');
        }
    };

    const deletePhoneNumber = async (number) => {
        try {
            const response = await fetch('/api/delete-number', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ number }), // Send the number to delete
            });

            if (response.ok) {
                const updatedNumbers = phoneNumbers.filter((n) => n !== number);
                setPhoneNumbers(updatedNumbers); // Update the state to reflect the deletion
            } else {
                const data = await response.json();
                setError(data.message); // Show error message if delete fails
            }
        } catch (error) {
            console.error('Error deleting number:', error);
            setError('Failed to delete number');
        }
    };

    return (
        <div className="p-4 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold text-black">Manage Phone Numbers</h2>
            <h3 className="text-xl text-gray-700">Logged in as: {adminName}</h3> {/* Display admin name */}
            <button onClick={onLogout} className="mt-2 p-2 bg-red-500 text-white rounded">
                Logout
            </button>
            <div className="mt-4 flex items-center">
                <input
                    type="text"
                    value={newPhoneNumber}
                    onChange={(e) => setNewPhoneNumber(e.target.value)}
                    placeholder="Add new phone number"
                    className="p-2 border border-gray-300 rounded flex-grow text-black"
                />
                <button onClick={addPhoneNumber} className="ml-2 p-2 bg-green-500 text-white rounded">
                    Add
                </button>
                {error && <p className="text-red-500 mt-2">{error}</p>}
            </div>

            <table className="mt-4 min-w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border border-gray-300 p-2 text-left text-black">Phone Number</th>
                        <th className="border border-gray-300 p-2 text-left text-black">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {phoneNumbers.map((number) => (
                        <tr key={number} className="border-b border-gray-200">
                            <td className="border border-gray-300 p-2 text-black">{number}</td>
                            <td className="border border-gray-300 p-2">
                                <button onClick={() => deletePhoneNumber(number)} className="text-red-500">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default function Home() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [adminName, setAdminName] = useState(''); // State to store admin name

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        const response = await fetch('/api/login?key=1234', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: username.trim(), password: password.trim() }), // Trim inputs
        });

        if (response.ok) {
            const data = await response.json(); // Get the response data
            setIsLoggedIn(true);
            setAdminName(data.name); // Set the admin name from the response
            alert('Login successful!'); // Confirm successful login
        } else {
            const data = await response.json();
            setError(data.message); // Show error message
        }
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setAdminName(''); // Clear admin name on logout
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-2xl font-bold text-black">Welcome to Phone Number Storage</h1>
            {isLoggedIn ? (
                <PhoneNumbers onLogout={handleLogout} adminName={adminName} />
            ) : (
                <form onSubmit={handleLogin} className="flex flex-col items-center bg-white p-4 rounded shadow-md">
                    <h2 className="text-xl font-bold text-black">Login</h2>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                        className="p-2 border border-gray-300 rounded mt-2"
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="p-2 border border-gray-300 rounded mt-2"
                    />
                    <button type="submit" className="mt-2 p-2 bg-blue-500 text-white rounded">Login</button>
                    {error && <p className="text-red-500">{error}</p>}
                </form>
            )}
        </div>
    );
}
