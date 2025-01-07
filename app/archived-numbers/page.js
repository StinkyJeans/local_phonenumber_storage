"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ArchivePage() {
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const router = useRouter();
  

  useEffect(() => {
    const fetchPhoneNumbers = async () => {
      try {
        const response = await fetch('/api/get-archive');
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
    fetchPhoneNumbers();
  }, []);

  const numbersPage = () => {
    router.push('/numbers');
  };

  const restorePhoneNumber = async (phone) => {
    try {
      console.log('Phone object:', phone); 
      const payload = {
        number: phone.number,
        name: phone.name,
        role: phone.role,
      };

      console.log('Sending data:', payload);

      const response = await fetch('/api/restore-number', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Phone number restored:', data);


        setPhoneNumbers(phoneNumbers.filter((item) => item.number !== phone.number));

        setToastMessage('Phone number has been restored');
        setTimeout(() => setToastMessage(''), 3000); 
      } else {
        const errorData = await response.json();
        console.error('Error:', errorData.message);
      }
    } catch (error) {
      console.error('Request failed:', error);
    }
  };

  const deletePhoneNumber = async (number) => {
    try {
      const response = await fetch('/api/delete-archive-number', {
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
  const totalPages = Math.max(1, Math.ceil(phoneNumbers.length / itemsPerPage));

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
      <div className="bg-white shadow-md rounded-lg p-6 w-fullmax-w-lg">
        <div className="mt-2 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Archived Phone Numbers</h2>
          <button
            onClick={numbersPage}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
          >
            Back
          </button>
        </div>
        {error && <p className="mt-2 text-red-500">{error}</p>}
        
        {toastMessage && (
          <div className="mt-2 bg-green-500 text-white p-2 rounded">
            {toastMessage}
          </div>
        )}
        {phoneNumbers.length === 0 && (
         <p className="mt-4 text-gray-500">No archived phone numbers</p>
        )}        
        <table className="mt-6 w-full border-collapse border border-gray-200 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left text-gray-800">Name</th>
              <th className="border border-gray-300 px-4 py-2 text-left text-gray-800">Role</th>
              <th className="border border-gray-300 px-4 py-2 text-left text-gray-800">Phone Number</th>
              <th className="border border-gray-300 px-4 py-2 text-left text-gray-800">Actions</th>
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
                    onClick={() => restorePhoneNumber(phone)}
                    className="px-3 py-1 text-green-500"
                  >
                    Restore
                  </button>
                </td>
                <td className="border border-gray-300 px-4 py-2 text-black">
                  <button
                    onClick={() => deletePhoneNumber(phone.number)}
                    className="px-3 py-1 text-green-500"
                  >
                    Delete
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

      </div>
    </div>
  );
}
