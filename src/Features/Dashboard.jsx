import React, { useState, useEffect } from 'react';

function Dashboard() {
  const [clients, setClients] = useState([]);
  const [selectedClients, setSelectedClients] = useState([]);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailDescription, setEmailDescription] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch('http://localhost:5000/clients');
        if (!response.ok) throw new Error('Failed to fetch clients');
        const data = await response.json();
        setClients(data);
      } catch (error) {
        setError(error.message);
        console.error('Error fetching clients:', error);
      }
    };

    fetchClients();
  }, []);

  const addClient = async (clientData) => {
    try {
      const response = await fetch('http://localhost:5000/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clientData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add client');
      }

      const newClient = await response.json();
      setClients([newClient, ...clients]);
    } catch (error) {
      setError(error.message);
      console.error('Error adding client:', error);
    }
  };

  const deleteClient = async (clientId) => {
    try {
      const response = await fetch(`http://localhost:5000/clients/${clientId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        if (response.status === 404) {
          console.error('Client not found:', clientId);
          setError('Client not found');
        } else {
          throw new Error('Failed to delete client');
        }
      }

      setClients(clients.filter(client => client._id !== clientId));
    } catch (error) {
      setError(error.message);
      console.error('Error deleting client:', error);
    }
  };

  const AddClientForm = ({ onAddClient }) => {
    const [name, setName] = useState('');
    const [pan, setPan] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
      e.preventDefault();
      onAddClient({ name, pan, email });
      setName('');
      setPan('');
      setEmail('');
    };

    return (
      <div>
        <div className='mb-6'>
          <div className='grid grid-cols-3 space-x-3'>
            <div className='shadow-xl py-7 border-2 bg-white border-blue-400 rounded-lg'>
              <div className='flex flex-col justify-center items-center'>
                <p className='text-xl font-semibold mb-2'>Completed</p>
                <div>
                  <p className='text-4xl font-semibold'>12</p>
                </div>
              </div>
            </div>
            <div className='shadow-xl py-7 border-2 bg-white border-blue-400 rounded-lg'><div className='flex flex-col justify-center items-center'>
              <p className='text-xl font-semibold mb-2'>Pending</p>
              <div>
                <p className='text-4xl font-semibold'>12</p>
              </div>
            </div></div>
            <div className='shadow-xl py-7 border-2 bg-white border-blue-400 rounded-lg'><div className='flex flex-col justify-center items-center'>
              <p className='text-xl font-semibold mb-2'>Total Client</p>
              <div>
                <p className='text-4xl font-semibold'>12</p>
              </div>
            </div></div>
          </div>
        </div>
        <form form onSubmit={handleSubmit} className="flex flex-col gap-3 p-4 bg-white shadow-md rounded-lg" >
          <label htmlFor="name" className="font-medium text-gray-700">Name</label>
          <input
            id="name"
            type="text"
            placeholder="Enter client name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2 border rounded-lg"
          />
          <label htmlFor="pan" className="font-medium text-gray-700">PAN</label>
          <input
            id="pan"
            type="text"
            placeholder="Enter client PAN"
            value={pan}
            onChange={(e) => setPan(e.target.value)}
            className="p-2 border rounded-lg"
          />
          <label htmlFor="email" className="font-medium text-gray-700">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Enter client email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 border rounded-lg"
          />
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg shadow-md">
            Add Client
          </button>
        </form>

      </div>
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedClients(clients.map(client => client._id));
    } else {
      setSelectedClients([]);
    }
  };

  const handleCheckboxChange = (e, clientId) => {
    if (e.target.checked) {
      setSelectedClients([...selectedClients, clientId]);
    } else {
      setSelectedClients(selectedClients.filter(id => id !== clientId));
    }

    if (selectedClients.length === 1 && !e.target.checked) {
      setShowEmailForm(false);
    }
  };

  const handleSendMessageClick = () => {
    if (selectedClients.length > 0) {
      setShowEmailForm(!showEmailForm);
    }
  };

  const handleEmailFormSubmit = async (e) => {
    e.preventDefault();

    if (!selectedClients.length || !emailSubject || !emailDescription) {
      setError('Missing required fields');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientIds: selectedClients,
          emailSubject,
          emailDescription,
          senderEmail: 'rahulchovatiya05@gmail.com',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send email');
      }

      alert('Email sent successfully!');
      setShowEmailForm(false);
      setEmailSubject('');
      setEmailDescription('');
      setSelectedClients([]);
    } catch (error) {
      setError(error.message);
      console.error('Error sending email:', error);
    }
  };

  return (
    <div className='bg-gray-100'>
      <div className="p-6 min-h-screen max-w-screen-md mx-auto">
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <h2 className="text-3xl font-bold mb-6">Clients Dashboard</h2>
        <div className="mb-8">
          <AddClientForm onAddClient={addClient} />
        </div>
        <div className="mb-8">
          {selectedClients.length > 0 && (
            <button onClick={handleSendMessageClick} className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg shadow-md">
              {showEmailForm ? 'Hide Email Form' : 'Send Message'}
            </button>
          )}
        </div>
        {showEmailForm && (
          <div className="mb-8 bg-white p-6 shadow-md rounded-lg">
            <h3 className="text-2xl font-bold mb-4">Send Email</h3>
            <form onSubmit={handleEmailFormSubmit}>
              <div className="mb-4">
                <label htmlFor="emailSubject" className="font-medium text-gray-700">Subject</label>
                <input
                  id="emailSubject"
                  type="text"
                  placeholder="Email subject"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="emailDescription" className="font-medium text-gray-700">Description</label>
                <textarea
                  id="emailDescription"
                  placeholder="Email description"
                  value={emailDescription}
                  onChange={(e) => setEmailDescription(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              <button type="submit" className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg shadow-md">
                Send Email
              </button>
            </form>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full table-auto bg-white shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-200 border-b">
                <th className="p-3">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      className="form-checkbox h-4 w-4"
                    />
                    <span>Select All</span>
                  </label>
                </th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">PAN</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.slice().reverse().map(client => (
                <tr key={client._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedClients.includes(client._id)}
                      onChange={(e) => handleCheckboxChange(e, client._id)}
                    />
                  </td>
                  <td className="p-3">{client.name}</td>
                  <td className="p-3">{client.pan}</td>
                  <td className="p-3">
                    <button
                      onClick={() => deleteClient(client._id)}
                      className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded-lg shadow-md"
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
    </div>
  );
}

export default Dashboard;
