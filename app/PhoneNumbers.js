const PhoneNumbers = ({ onLogout }) => {
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [newPhoneNumber, setNewPhoneNumber] = useState('');
  const [editPhoneNumber, setEditPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(-1); // Track which number is being edited

  // Load existing phone numbers from the API
  useEffect(() => {
      const fetchPhoneNumbers = async () => {
          const response = await fetch('/api/get-number');
          if (response.ok) {
              const data = await response.json();
              setPhoneNumbers(data);
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

  // Update a phone number
  const updatePhoneNumber = async () => {
      if (editPhoneNumber.trim()) {
          const updatedNumbers = [...phoneNumbers];
          updatedNumbers[editingIndex] = editPhoneNumber;

          const response = await fetch('/api/update-number', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ number: editPhoneNumber }),
          });

          if (response.ok) {
              setPhoneNumbers(updatedNumbers);
              setEditPhoneNumber(''); // Clear input field
              setIsEditing(false);
              setEditingIndex(-1);
          } else {
              const data = await response.json();
              setError(data.message); // Display error message
          }
      } else {
          setError('Phone number cannot be empty');
      }
  };

  // Delete a phone number
  const deletePhoneNumber = async (number) => {
      const updatedNumbers = phoneNumbers.filter((n) => n !== number);
      setPhoneNumbers(updatedNumbers);
      // Ideally, you would also implement a delete endpoint to handle deletion in the file.
  };

  return (
      <div className="p-4">
          <h2 className="text-2xl font-bold">Manage Phone Numbers</h2>
          <button onClick={onLogout} className="mt-2 p-2 bg-red-500 text-white rounded">
              Logout
          </button>
          <div className="mt-4">
              <input
                  type="text"
                  value={newPhoneNumber}
                  onChange={(e) => setNewPhoneNumber(e.target.value)}
                  placeholder="Add new phone number"
                  className="p-2 border border-gray-300 rounded"
              />
              <button onClick={addPhoneNumber} className="ml-2 p-2 bg-green-500 text-white rounded">
                  Add
              </button>
              {error && <p className="text-red-500">{error}</p>}
          </div>
          <ul className="mt-4">
              {phoneNumbers.map((number, index) => (
                  <li key={number} className="flex justify-between items-center mt-2">
                      {isEditing && editingIndex === index ? (
                          <>
                              <input
                                  type="text"
                                  value={editPhoneNumber}
                                  onChange={(e) => setEditPhoneNumber(e.target.value)}
                                  className="p-2 border border-gray-300 rounded"
                              />
                              <button onClick={updatePhoneNumber} className="ml-2 p-2 bg-blue-500 text-white rounded">
                                  Save
                              </button>
                              <button onClick={() => { setIsEditing(false); setEditingIndex(-1); }} className="ml-2 p-2 bg-red-500 text-white rounded">
                                  Cancel
                              </button>
                          </>
                      ) : (
                          <>
                              <span>{number}</span>
                              <button onClick={() => { setIsEditing(true); setEditPhoneNumber(number); setEditingIndex(index); }} className="text-blue-500">Update</button>
                              <button onClick={() => deletePhoneNumber(number)} className="text-red-500">Delete</button>
                          </>
                      )}
                  </li>
              ))}
          </ul>
      </div>
  );
};
