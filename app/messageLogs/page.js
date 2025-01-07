'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowDownTrayIcon } from '@heroicons/react/24/solid';
import * as XLSX from 'xlsx';

const MessageLogs = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const messagesPerPage = 10;
  const router = useRouter();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch('/api/messages');
        const data = await response.json();
        setMessages(data.messages);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch messages');
        setLoading(false);
      }
    };

    fetchMessages();

    const interval = setInterval(() => {
      fetchMessages();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleNextPage = () => {
    if (currentPage < Math.ceil(messages.length / messagesPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const numbersPage = () => {
    router.push('/numbers');
  };

  const handleExportToExcel = () => {
    const filteredMessages = messages.map((message) => ({
      FROM: message.from,
      TO: message.to,
      BODY: message.body,
      'DATE SENT': new Date(message.dateSent).toLocaleString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(filteredMessages);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Messages');
    XLSX.writeFile(workbook, 'message_logs.xlsx');
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const indexOfLastMessage = currentPage * messagesPerPage;
  const indexOfFirstMessage = indexOfLastMessage - messagesPerPage;
  const currentMessages = messages.slice(indexOfFirstMessage, indexOfLastMessage);

  return (
    <div className="p-10 bg-gray-50 min-h-screen flex justify-center items-center">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-4xl">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Message Logs</h1>
          <div className="flex space-x-4">
            <button
              onClick={handleExportToExcel}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 flex items-center"
            >
              <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
              Export to Excel
            </button>
            <button
              onClick={numbersPage}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
            >
              Back
            </button>
          </div>
        </div>
        <h2 className="text-gray-900">This shows your message logs</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded shadow">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">From</th>
                <th className="py-2 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">To</th>
                <th className="py-2 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Body</th>
                <th className="py-2 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Date Sent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentMessages.map((message, index) => (
                <tr key={message.sid} className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <td className="py-2 px-4 text-sm text-gray-900">{message.from}</td>
                  <td className="py-2 px-4 text-sm text-gray-900">{message.to}</td>
                  <td className="py-2 px-4 text-sm text-gray-900">{message.body}</td>
                  <td className="py-2 px-4 text-sm text-gray-900">{new Date(message.dateSent).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Previous
          </button>
          <span className="text-gray-700">Page {currentPage} of {Math.ceil(messages.length / messagesPerPage)}</span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === Math.ceil(messages.length / messagesPerPage)}
            className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${currentPage === Math.ceil(messages.length / messagesPerPage) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageLogs;
