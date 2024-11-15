'use client';
import { useState, useEffect } from 'react';

const PhoneNumbers = ({ onLogout, adminName }) => {
    const [phoneNumbers, setPhoneNumbers] = useState([]);
    const [newPhoneNumber, setNewPhoneNumber] = useState('');
    const [error, setError] = useState('');
    const [warning, setWarning] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('');

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

    const addPhoneNumber = async () => {
        if (newPhoneNumber.trim().length === 11) {
            const response = await fetch('/api/add-number', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ number: newPhoneNumber }),
            });

            if (response.ok) {
                const updatedNumbers = [...phoneNumbers, newPhoneNumber];
                setPhoneNumbers(updatedNumbers);
                setNewPhoneNumber('');
                setWarning('');
                setToastMessage('Phone number has been added');
                setToastType('success');
                setTimeout(() => setToastMessage(''), 3000);
            } else {
                const data = await response.json();
                setError(data.message);
            }
        } else {
            setWarning('Phone number must be exactly 11 digits long');
        }
    };

    const deletePhoneNumber = async (number) => {
        try {
            const response = await fetch('/api/delete-number', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ number }),
            });

            if (response.ok) {
                const updatedNumbers = phoneNumbers.filter((n) => n !== number);
                setPhoneNumbers(updatedNumbers);
                setToastMessage('Phone number has been deleted');
                setToastType('success');
                setTimeout(() => setToastMessage(''), 3000);
            } else {
                const data = await response.json();
                setError(data.message);
            }
        } catch (error) {
            console.error('Error deleting number:', error);
            setError('Failed to delete number');
        }
    };

    const phoneNumbersPerPage = 5;
    const totalPages = Math.ceil(phoneNumbers.length / phoneNumbersPerPage);

    const paginatedPhoneNumbers = phoneNumbers.slice(
        currentPage * phoneNumbersPerPage,
        (currentPage + 1) * phoneNumbersPerPage
    );

    const nextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value) && value.length <= 11) {
            setNewPhoneNumber(value);
        }
    };

    return (
        <div className="p-10 bg-white shadow-md rounded-lg">
            {toastMessage && (
                <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 p-4 bg-${toastType === 'success' ? 'green' : 'red'}-500 text-white rounded`}>
                    {toastMessage}
                </div>
            )}
            <h2 className="text-2xl font-bold text-black">Manage Phone Numbers</h2>
            <h3 className="text-xl text-gray-700">Logged in as: {adminName}</h3>
            <button onClick={onLogout} className="mt-2 p-2 bg-red-500 text-white rounded">
                Logout
            </button>
            <div className="mt-4 flex items-center">
                <input
                    type="text"
                    value={newPhoneNumber}
                    onChange={handleInputChange}
                    placeholder="Add new phone number"
                    className="p-2 border border-gray-300 rounded flex-grow text-black"
                />
                <button
                    onClick={addPhoneNumber}
                    className="ml-2 p-2 bg-green-500 text-white rounded"
                >
                    Add
                </button>
            </div>
            {warning && <p className="mt-2 text-red-500">{warning}</p>}
            {error && <p className="mt-2 text-red-500">{error}</p>}
            
            <table className="mt-4 min-w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border border-gray-300 p-2 text-left text-black">Phone Number</th>
                        <th className="border border-gray-300 p-2 text-left text-black">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedPhoneNumbers.map((number) => (
                        <tr key={number} className="border-b border-gray-200">
                            <td className="border border-gray-300 p-2 text-black">{number}</td>
                            <td className="border border-gray-300 p-2">
                                <button onClick={() => deletePhoneNumber(number)} className="text-red-500">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex justify-between mt-4">
                <button
                    onClick={prevPage}
                    disabled={currentPage === 0}
                    className={`p-2 rounded text-black ${currentPage === 0 ? 'bg-gray-300' : 'bg-blue-500 hover:bg-blue-600'}`}
                >
                    Previous
                </button>
                <button
                    onClick={nextPage}
                    disabled={currentPage === totalPages - 1}
                    className={`p-2 rounded text-black ${currentPage === totalPages - 1 ? 'bg-gray-300' : 'bg-blue-500 hover:bg-blue-600'}`}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default function Home() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [adminName, setAdminName] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        const response = await fetch('/api/login?key=1234', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: username.trim(), password: password.trim() }),
        });

        if (response.ok) {
            const data = await response.json();
            setIsLoggedIn(true);
            setAdminName(data.name);
            alert('Login successful!');
        } else {
            const data = await response.json();
            setError(data.message);
        }
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setAdminName('');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-2xl font-bold text-black"></h1>
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
                        className="p-2 border border-gray-300 rounded mt-2 text-black"
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="p-2 border border-gray-300 rounded mt-2 text-black"
                    />
                    <button type="submit" className="mt-2 p-2 px-5 bg-blue-500 text-white rounded">Login</button>
                    {error && <p className="text-red-500">{error}</p>}
                </form>
            )}
        </div>
    );
}
