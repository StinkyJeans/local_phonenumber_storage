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
  const [threshold, setThreshold] = useState('');
  const [thresholdError, setThresholdError] = useState('');
  const [currentThreshold, setCurrentThreshold] = useState('');
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

    const fetchCurrentThreshold = async () => {
      try {
        const response = await fetch('/api/get-threshold');
        if (response.ok) {
          const data = await response.json();
          setCurrentThreshold(data.threshold); 
        } else {
          setError('Failed to fetch threshold');
        }
      } catch (error) {
        setError('Error fetching threshold');
      }
    };

    fetchPhoneNumbers();
    fetchAdminName();
    fetchCurrentThreshold();
  }, []);

  const addPhoneNumber = async () => {
    if (phoneNumbers.length >= 5) {
      setWarning('Max limit of phone numbers added has been reached!');
      return;
    }

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

  const messageLogs = () => {
    router.push('/messageLogs');
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

  const handleThresholdChange = (e) => {
    setThreshold(e.target.value);
  };

  const handleSetThreshold = async () => {
    if (!threshold) {
      setWarning('Please enter a valid threshold value');
      return;
    }

    try {
      const response = await fetch('/api/set-threshold', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ threshold }),
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentThreshold(data.threshold); 
        setToastMessage(`Threshold set to ${threshold}`);
        setTimeout(() => setToastMessage(''), 3000);
        setWarning('');
      } else {
        setError('Failed to set threshold');
      }
    } catch (error) {
      setError('Error setting threshold');
    }
  };

  return (
    <div className="p-10 bg-gray-50 min-h-screen flex justify-center items-center">
      {toastMessage && (
        <div
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 p-4 text-white rounded shadow-md ${toastMessage.includes('deleted') ? 'bg-red-500' : 'bg-green-500'}`}
        >
          {toastMessage}
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Manage Phone Numbers</h2>
          <button
            onClick={handleLogout}
            className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        <div className="flex justify-between items-center mt-4">
          {adminName && (
            <div className="text-md text-gray-600">
              <strong>Admin:</strong> {adminName}
            </div>
          )}
        </div>

        <div className="mt-6">
          {error && <p className="mt-2 text-red-500">{error}</p>}
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
                <td className="border border-gray-300 px-4 py-2 text-gray-800">
                  <button
                    onClick={() => deletePhoneNumber(number)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="mt-4">
          <button
            onClick={messageLogs}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            View Message Logs
          </button>
        </div>

        <div className="mt-10">
          <h3 className="font-bold text-gray-800">Current Threshold: {currentThreshold || 'Not Set'}</h3>
          <div className="mt-4 flex items-center">
            <input
              type="number"
              value={threshold}
              onChange={handleThresholdChange}
              placeholder="Set threshold"
              className="p-2 border border-gray-300 rounded-l flex-grow text-black"
            />
            <button
              onClick={handleSetThreshold}
              className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Set
            </button>
          </div>
          {thresholdError && <p className="mt-2 text-red-500">{thresholdError}</p>}
        </div>
      </div>
    </div>
  );
}
