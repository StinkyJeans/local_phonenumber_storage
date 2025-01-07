"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import * as XLSX from 'xlsx';

export default function PhoneNumbersPage() {
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [newPhoneNumber, setNewPhoneNumber] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');
  const [valueWarning, setValueWarning] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [adminName, setAdminName] = useState('');
  const [threshold, setThreshold] = useState('');
  const [thresholdError, setThresholdError] = useState('');
  const [currentThreshold, setCurrentThreshold] = useState('');
  const router = useRouter();
  const [success,setSuccess] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; 

  
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
    let sanitizedNumber = newPhoneNumber.trim().replace(/^0+/, '');
    if (sanitizedNumber.length === 10) {
      const completeNumber = `+63${sanitizedNumber}`;

      if (!newName) {
        setError('Please input name');
        return;
      }

      if (!newRole) {
        setError('Please input role');
        return;
      }

      if (!newPhoneNumber) {
        setError('Please input phone number');
        return;
      }

      try {
        const response = await fetch('/api/add-number', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ number: completeNumber, name: newName, role: newRole }),
        });

        if (response.ok) {
          const data = await response.json();
          setPhoneNumbers(data.phoneNumbers);
          setNewPhoneNumber('');
          setNewName('');
          setNewRole('');
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


  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file && file.name.endsWith('.xlsx')) {
      try {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const data = e.target.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(sheet);
          const phoneNumbers = jsonData.map(row => {
            const rawNumber = row.PhoneNumber || '';
            const formattedNumber = rawNumber.startsWith('0')
              ? '+63' + rawNumber.slice(1)
              : rawNumber;
  
            return {
              name: row.Name,
              role: row.Role,
              number: formattedNumber,
            };
          });

          const response = await fetch('/api/upload-phone-number', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ phoneNumbers }),
          });
  
          if (response.ok) {
            setSuccess('Phone numbers uploaded successfully!');
            setError('');
            window.location.reload()
          } else {
            setError('Failed to upload phone numbers');
            setSuccess('');
          }
        };
        reader.readAsBinaryString(file);
      } catch (error) {
        setError('Error reading Excel file');
        setSuccess('');
      }
    } else {
      setError('Please upload a valid Excel (.xlsx) file');
      setSuccess('');
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
            setToastMessage('Phone number has been archived');
            setTimeout(() => setToastMessage(''), 3000);
        } else {
            setError('Failed to archive phone number');
        }
    } catch (error) {
        setError('Error archiving phone number');
    }
};

  const handleLogout = () => {
    router.push('/login');
  };

  const messageLogs = () => {
    router.push('/messageLogs');
  };

  const archived = () => {
    router.push('/archived-numbers');
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
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setThreshold(value);
      setThresholdError('');
    } else {
      setThresholdError('Threshold must be a number.');
    }
  };

  const handleSetThreshold = async () => {
    if (!threshold) {
      setValueWarning('Please enter a valid threshold value');
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
        setValueWarning('');
        
        
        if (threshold === currentThreshold) {
          setValueWarning('');
        }
      } else {
        setError('Failed to set threshold');
      }
    } catch (error) {
      setError('Error setting threshold');
    }
  };
  
  const handleRoleChange = (e) => {
    const value = e.target.value;
    if (/^[a-zA-Z\s]*$/.test(value)) {
      setNewRole(value);
    }
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    if (/^[a-zA-Z\s]*$/.test(value)) {
      setNewName(value);
    }
  };
  const totalPages = Math.ceil(phoneNumbers.length / itemsPerPage);

  const paginatedPhoneNumbers = phoneNumbers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
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

      <div className="bg-white shadow-md rounded-lg p-6 w-fullmax-w-lg">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Manage Phone Numbers</h2>
          <button
            onClick={handleLogout}
            className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        <div className="mt-4">
          {adminName && (
            <div className="text-md text-gray-600">
              <strong>Admin:</strong> {adminName}
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center">
          <input
            type="text"
            value={newName}
            onChange={handleNameChange}
            placeholder="Enter Name"
            className="p-2 border border-gray-300 rounded-l text-black ml-2"
          />
          <input
            type="text"
            value={newRole}
            onChange={handleRoleChange}
            placeholder="Enter Role"
            className="p-2 border border-gray-300 rounded-r text-black ml-2"
          />
          <button
            onClick={addPhoneNumber}
            className="ml-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            disabled={!newName || !newRole || !newPhoneNumber}
          >
            Add
          </button>
        </div>
        <div className="mt-4 ml-2">
          <span className="p-3 bg-gray-200 border border-gray-300 rounded-l text-black">+63</span>
          <input
            type="text"
            value={newPhoneNumber}
            onChange={handlePhoneNumberChange}
            placeholder="Enter phone number"
            className="p-2 border border-gray-300 rounded-r flex-grow text-black"
          />
        </div>
        {warning && <p className="mt-2 text-red-500">{warning}</p>}

        <div className="mt-2 text-black">
          <p>Upload Phone Numbers</p>
         <input 
           className='cursor-pointer'
           type="file"
           accept=".xlsx"
           onChange={handleFileUpload}
         />
         {success && <p className="text-green-500">{success}</p>}
         {error && <p className="text-red-500">{error}</p>}
        </div>

        <table className="mt-4 w-full border-collapse border border-gray-200 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left text-gray-800">Name</th>
              <th className="border border-gray-300 px-4 py-2 text-left text-gray-800">Role</th>
              <th className="border border-gray-300 px-4 py-2 text-left text-gray-800">Phone Number</th>
              <th className="border border-gray-300 px-4 py-2 text-left text-gray-800">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedPhoneNumbers.map((phone) => (
              <tr key={phone.number} className="border-b">
                <td className="border border-gray-300 px-4 py-2 text-black">{phone.name}</td>
                <td className="border border-gray-300 px-4 py-2 text-black">{phone.role}</td>
                <td className="border border-gray-300 px-4 py-2 text-black">{phone.number}</td>
                <td className="border border-gray-300 px-4 py-2 text-black">
                  <button
                    onClick={() => deletePhoneNumber(phone.number)}
                    className="px-3 py-1 text-red-500"
                  >
                    Archive
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            className="px-4 py-2 bg-gray-300 text-black rounded-l hover:bg-gray-400"
            disabled={currentPage <= 1}
          >
            Previous
          </button>
          <span className="px-4 py-2 text-black">{currentPage} of {totalPages}</span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className="px-4 py-2 bg-gray-300 text-black rounded-r hover:bg-gray-400"
            disabled={currentPage >= totalPages}
          >
            Next
          </button>
        </div>

        <div className="mt-2 flex justify-between items-center">
          <button
            onClick={messageLogs}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            View Message Logs
          </button>
        <button
            onClick={archived}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            View Archived Phone Numbers
          </button>
        </div>

        <div className="mt-10">
          {currentThreshold && (
            <div className="text-md text-gray-600">
              <strong>Current Threshold:</strong> {currentThreshold}
            </div>
          )}
        </div>

        <div className="mt-2 flex justify-between items-center">
          <input
            type="text"
            value={threshold}
            onChange={handleThresholdChange}
            placeholder="Enter Threshold Value"
            className="p-2 border border-gray-300 rounded-l text-black"
            
          />
          <button
            onClick={handleSetThreshold}
            className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Set Threshold
          </button>
        </div>
        {valueWarning && <p className="mt-2 text-red-500">{valueWarning}</p>}
        <div>
        {thresholdError && <p className="mt-2 text-red-500">{thresholdError}</p>}
        </div>
      </div>
    </div>
  );
}
