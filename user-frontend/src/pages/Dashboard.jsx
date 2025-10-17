import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getInstances } from '../services/conversationService';
import ConversationCard from '../components/ConversationCard';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const [instances, setInstances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchInstances();
  }, []);

  const fetchInstances = async () => {
    try {
      setLoading(true);
      const { success, data, error } = await getInstances();
      
      if (success) {
        setInstances(data);
      } else {
        setError(error);
      }
    } catch (error) {
      console.error('Error fetching instances:', error);
      setError('Failed to fetch conversations');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleStartNewConversation = () => {
    // For now, we'll navigate to a placeholder page
    // In a real app, you would show a template selection modal
    alert('Feature to start new conversation will be implemented');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onLogout={handleLogout} />
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Your Conversations</h1>
            <button
              onClick={handleStartNewConversation}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Start New Conversation
            </button>
          </div>
          
          {error && (
            <div className="rounded-md bg-red-50 p-4 mb-6">
              <div className="text-sm text-red-700">
                {error}
              </div>
            </div>
          )}
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div>Loading...</div>
            </div>
          ) : instances.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No conversations</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating a new conversation.
              </p>
              <div className="mt-6">
                <button
                  onClick={handleStartNewConversation}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Start New Conversation
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {instances.map((instance) => (
                <ConversationCard 
                  key={instance._id} 
                  instance={instance} 
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;