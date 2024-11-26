'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PhoneNumbersPage() {
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [newPhoneNumber, setNewPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [adminName, setAdminName] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchPhoneNumbers = async () => {
      try {
        const response = await fetch('/api/get-number');
        if (response.ok) {
          const data = await response.json();
          setPhoneNumbers(data.phoneNumbers || []); 
        } else {
          setError('Failed to fetch phone numbers');
        }
      } catch (error) {
        setError('Error fetching phone numbers');
      }
    };

    const fetchAdminName = async () => {
      try {
        const response = await fetch('/api/login?key=1234', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username: 'admin', password: 'password1234' }),
        });

        const data = await response.json();
        if (response.ok) {
          setAdminName(data.name); 
        } else {
          setError('Failed to fetch admin name');
        }
      } catch (error) {
        setError('Error fetching admin name');
      }
    };

    fetchPhoneNumbers();
    fetchAdminName(); 
  }, []);

  const addPhoneNumber = async () => {
    let sanitizedNumber = newPhoneNumber.trim().replace(/^0+/, '');
    if (sanitizedNumber.length === 10) {
      const completeNumber = `+63${sanitizedNumber}`;

      try {
        const response = await fetch('/api/add-number', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ number: completeNumber }),
        });

        if (response.ok) {
          const data = await response.json();
          setPhoneNumbers(data.phoneNumbers); 
          setNewPhoneNumber('');
          setToastMessage('Phone number has been added');
          setTimeout(() => setToastMessage(''), 3000);
          setWarning('');
        } else {
          setError('Failed to add phone number');
        }
      } catch (error) {
        setError('Error adding phone number');
      }
    } else {
      setWarning('Phone number must be exactly 10 digits long.');
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
        const data = await response.json();
        setPhoneNumbers(data.phoneNumbers); 
        setToastMessage('Phone number has been deleted');
        setTimeout(() => setToastMessage(''), 3000);
      } else {
        setError('Failed to delete phone number');
      }
    } catch (error) {
      setError('Error deleting phone number');
    }
  };

  const handleLogout = () => {
    router.push('/login');
  };

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 11) {
      setNewPhoneNumber(value);
    }
    if (value.length > 11) {
      setWarning('Phone number cannot be longer than 11 digits.');
    } else {
      setWarning('');
    }
  };

  return (
    <div className="p-10 bg-gray-50 min-h-screen flex justify-center items-center">
      {toastMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 p-4 bg-green-500 text-white rounded shadow-md">
          {toastMessage}
        </div>
      )}
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Manage Phone Numbers</h2>
          
        </div>
        <div className="flex justify-between items-center">
        {adminName && (
          <div className="mt-4 text-md text-gray-600 ">
            <strong>Admin:</strong> {adminName}
            
          </div>
          
        )}
        <button
            onClick={handleLogout}
            className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
        <div className="mt-6 flex items-center">
          <span className="p-2 bg-gray-200 border border-gray-300 rounded-l text-black">+63</span>
          <input
            type="text"
            value={newPhoneNumber}
            onChange={handlePhoneNumberChange}
            placeholder="Enter phone number"
            className="p-2 border border-gray-300 rounded-r flex-grow text-black"
          />
          <button
            onClick={addPhoneNumber}
            className="ml-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Add
          </button>
        </div>
        {warning && <p className="mt-2 text-red-500">{warning}</p>}
        {error && <p className="mt-2 text-red-500">{error}</p>}

        <table className="mt-6 w-full border-collapse border border-gray-200 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left text-gray-800">Phone Number</th>
              <th className="border border-gray-300 px-4 py-2 text-left text-gray-800">Actions</th>
            </tr>
          </thead>
          <tbody>
            {phoneNumbers.map((number, index) => (
              <tr
                key={index}
                className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100`}
              >
                <td className="border border-gray-300 px-4 py-2 text-gray-800">{number}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    onClick={() => deletePhoneNumber(number)}
                    className="px-2 py-1 text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
