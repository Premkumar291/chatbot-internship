import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTemplates, startInstance } from '../services/conversationService';
import Navbar from '../components/Navbar';
import { useAuth } from '../hooks/useAuth';

const TemplateSelection = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [startingTemplate, setStartingTemplate] = useState(null);
  
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const { success, data, error } = await getTemplates();
      
      if (success) {
        setTemplates(data);
      } else {
        setError(error);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
      setError('Failed to fetch templates');
    } finally {
      setLoading(false);
    }
  };

  const handleStartConversation = async (templateId) => {
    try {
      setStartingTemplate(templateId);
      const { success, data, error } = await startInstance(templateId);
      
      if (success) {
        navigate(`/conversation/${data._id}`);
      } else {
        setError(error);
      }
    } catch (error) {
      console.error('Error starting conversation:', error);
      setError('Failed to start conversation');
    } finally {
      setStartingTemplate(null);
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
          <div className="text-gray-600">Loading templates...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onLogout={handleLogout} />
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Start a New Conversation</h1>
              <p className="mt-2 text-sm text-gray-600">Choose a conversation template to get started</p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </button>
          </div>
          
          {error && (
            <div className="rounded-md bg-red-50 p-4 mb-6">
              <div className="text-sm text-red-700">
                {error}
              </div>
            </div>
          )}
          
          {templates.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No templates available</h3>
              <p className="mt-1 text-sm text-gray-500">
                Contact your administrator to add conversation templates.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {templates.map((template) => (
                <div key={template._id} className="bg-white overflow-hidden shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="px-6 py-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {template.title}
                      </h3>
                      {template.metadata?.category && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {template.metadata.category.replace('_', ' ')}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-4 min-h-[3rem]">
                      {template.description}
                    </p>
                    <div className="flex items-center text-xs text-gray-500 mb-4">
                      <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      {template.nodes?.length || 0} conversation steps
                    </div>
                    <button
                      onClick={() => handleStartConversation(template._id)}
                      disabled={startingTemplate === template._id}
                      className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      {startingTemplate === template._id ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Starting...
                        </>
                      ) : (
                        <>
                          <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          Start Conversation
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateSelection;
