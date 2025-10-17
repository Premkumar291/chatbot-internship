import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getInstance, chooseOption } from '../services/conversationService';
import Navbar from '../components/Navbar';
import { useAuth } from '../hooks/useAuth';

const ConversationView = () => {
  const [instance, setInstance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  
  const { id } = useParams();
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchInstance();
  }, [id]);

  const fetchInstance = async () => {
    try {
      setLoading(true);
      const { success, data, error } = await getInstance(id);
      
      if (success) {
        setInstance(data);
      } else {
        setError(error);
      }
    } catch (error) {
      console.error('Error fetching instance:', error);
      setError('Failed to fetch conversation');
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = async (optionKey) => {
    try {
      setSelectedOption(optionKey);
      const { success, data: _optionData, error } = await chooseOption(id, optionKey);
      
      if (success) {
        // Refresh the instance to get updated state
        fetchInstance();
      } else {
        setError(error);
      }
    } catch (error) {
      console.error('Error selecting option:', error);
      setError('Failed to select option');
    } finally {
      setSelectedOption('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar onLogout={handleLogout} />
        <div className="flex justify-center items-center h-64">
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar onLogout={handleLogout} />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">
                {error}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!instance) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar onLogout={handleLogout} />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="text-center">
              <h3 className="mt-2 text-sm font-medium text-gray-900">Conversation not found</h3>
              <p className="mt-1 text-sm text-gray-500">
                The conversation you're looking for doesn't exist or has been deleted.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => navigate('/')}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Find current node
  const currentNode = instance.template.nodes.find(node => node.key === instance.currentNodeKey);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onLogout={handleLogout} />
      
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {instance.template.title}
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                {instance.template.description}
              </p>
            </div>
            
            <div className="px-4 py-5 sm:p-6">
              <div className="flow-root">
                <ul className="space-y-4">
                  {instance.history.map((item, index) => (
                    <li key={index} className="relative pl-4">
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                            <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                            </svg>
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 py-1.5">
                          <div className="text-sm text-gray-500">
                            <p className="font-medium text-gray-900">You</p>
                            <p className="mt-1">{item.response}</p>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                  
                  {currentNode && (
                    <li className="relative pl-4">
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center ring-8 ring-white">
                            <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
                            </svg>
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 py-1.5">
                          <div className="text-sm text-gray-500">
                            <p className="font-medium text-gray-900">Bot</p>
                            <p className="mt-1">{currentNode.text}</p>
                            
                            <div className="mt-3 space-y-2">
                              {currentNode.options.map((option) => (
                                <button
                                  key={option.key}
                                  onClick={() => handleOptionSelect(option.key)}
                                  disabled={selectedOption === option.key}
                                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                  {selectedOption === option.key ? 'Selecting...' : option.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  )}
                </ul>
              </div>
              
              {!currentNode && (
                <div className="mt-6 text-center">
                  <div className="rounded-md bg-green-50 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-green-800">
                          Conversation completed
                        </h3>
                        <div className="mt-2 text-sm text-green-700">
                          <p>This conversation has reached its end.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <button
                      onClick={() => navigate('/')}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Back to Dashboard
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationView;