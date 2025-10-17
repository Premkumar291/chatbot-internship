import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getInstance, chooseOption, deleteInstance } from '../services/conversationService';
import Navbar from '../components/Navbar';
import { useAuth } from '../hooks/useAuth';

const ConversationView = () => {
  const [instance, setInstance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
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

  const handleDeleteConversation = async () => {
    try {
      setDeleting(true);
      const { success, error } = await deleteInstance(id);
      
      if (success) {
        navigate('/');
      } else {
        setError(error || 'Failed to delete conversation');
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
      setError('Failed to delete conversation');
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar onLogout={handleLogout} />
      
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="bg-white shadow-lg rounded-t-xl px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {instance.template.title}
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  {instance.template.description}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  title="Delete conversation"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Delete Confirmation */}
            {showDeleteConfirm && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800 mb-3">
                  Are you sure you want to delete this conversation? This action cannot be undone.
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={handleDeleteConversation}
                    disabled={deleting}
                    className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-red-400"
                  >
                    {deleting ? 'Deleting...' : 'Yes, Delete'}
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={deleting}
                    className="px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Chat Container */}
          <div className="bg-white shadow-lg rounded-b-xl">
            <div className="px-6 py-6 max-h-[600px] overflow-y-auto">
              <div className="space-y-6">
                {/* History Messages */}
                {instance.history.map((item, index) => {
                  const node = instance.template.nodes.find(n => n.key === item.nodeKey);
                  return (
                    <div key={index} className="space-y-3">
                      {/* Bot Message */}
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
                            <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                              <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                            </svg>
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg px-4 py-3 shadow-sm border border-blue-100">
                            <p className="text-sm font-medium text-blue-900 mb-1">Assistant</p>
                            <p className="text-gray-800">{node?.text}</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* User Response */}
                      <div className="flex items-start space-x-3 justify-end">
                        <div className="flex-1 flex justify-end">
                          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg px-4 py-3 shadow-md max-w-md">
                            <p className="text-sm font-medium text-white mb-1">You</p>
                            <p className="text-white">{item.response}</p>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center shadow-md">
                            <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {/* Current Node */}
                {currentNode && (
                  <div className="space-y-4">
                    {/* Bot Message with Options */}
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center shadow-md animate-pulse">
                          <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                            <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg px-4 py-3 shadow-sm border border-blue-100">
                          <p className="text-sm font-medium text-blue-900 mb-1">Assistant</p>
                          <p className="text-gray-800 mb-4">{currentNode.text}</p>
                          
                          {/* Options */}
                          <div className="space-y-2">
                            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Choose an option:</p>
                            {currentNode.options.map((option) => (
                              <button
                                key={option.key}
                                onClick={() => handleOptionSelect(option.key)}
                                disabled={selectedOption === option.key}
                                className="w-full text-left px-4 py-3 bg-white border-2 border-blue-200 rounded-lg text-gray-800 hover:bg-blue-50 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-medium">{option.label}</span>
                                  {selectedOption === option.key ? (
                                    <svg className="animate-spin h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                  ) : (
                                    <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                  )}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Completion Message */}
                {!currentNode && (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 shadow-lg mb-4">
                      <svg className="h-10 w-10 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Conversation Completed! 🎉
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Thank you for your time. This conversation has reached its end.
                    </p>
                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={() => navigate('/')}
                        className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                      >
                        <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Back to Dashboard
                      </button>
                      <button
                        onClick={() => navigate('/templates')}
                        className="inline-flex items-center px-6 py-3 border border-gray-300 text-sm font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                      >
                        <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Start New
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationView;