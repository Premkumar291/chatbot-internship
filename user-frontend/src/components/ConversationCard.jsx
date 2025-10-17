import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteInstance } from '../services/conversationService';

const ConversationCard = ({ instance, onDelete }) => {
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleViewConversation = () => {
    navigate(`/conversation/${instance._id}`);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setShowConfirm(true);
  };

  const handleConfirmDelete = async (e) => {
    e.stopPropagation();
    try {
      setDeleting(true);
      const { success, error } = await deleteInstance(instance._id);
      
      if (success) {
        if (onDelete) {
          onDelete(instance._id);
        }
      } else {
        alert(error || 'Failed to delete conversation');
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
      alert('Failed to delete conversation');
    } finally {
      setDeleting(false);
      setShowConfirm(false);
    }
  };

  const handleCancelDelete = (e) => {
    e.stopPropagation();
    setShowConfirm(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white overflow-hidden shadow-lg rounded-xl hover:shadow-2xl transition-shadow duration-300 border border-gray-100">
      <div className="px-6 py-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900">
            {instance.template?.title || 'Conversation'}
          </h3>
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(instance.status)}`}>
              {instance.status === 'active' && (
                <svg className="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 8 8">
                  <circle cx="4" cy="4" r="3" />
                </svg>
              )}
              {instance.status.charAt(0).toUpperCase() + instance.status.slice(1)}
            </span>
            <button
              onClick={handleDeleteClick}
              disabled={deleting}
              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors duration-200"
              title="Delete conversation"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-4 min-h-[2.5rem]">
          {instance.template?.description || 'No description'}
        </p>
      </div>

      {showConfirm && (
        <div className="px-6 py-3 bg-red-50 border-t border-red-100">
          <p className="text-sm text-red-800 mb-3">
            Are you sure you want to delete this conversation? This action cannot be undone.
          </p>
          <div className="flex space-x-2">
            <button
              onClick={handleConfirmDelete}
              disabled={deleting}
              className="flex-1 px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-red-400"
            >
              {deleting ? 'Deleting...' : 'Yes, Delete'}
            </button>
            <button
              onClick={handleCancelDelete}
              disabled={deleting}
              className="flex-1 px-3 py-2 bg-white text-gray-700 text-sm font-medium rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="border-t border-gray-100 px-6 py-4 bg-gray-50">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="text-xs">
            <span className="text-gray-500 block mb-1">Started</span>
            <span className="font-medium text-gray-900">{formatDate(instance.createdAt)}</span>
          </div>
          <div className="text-xs">
            <span className="text-gray-500 block mb-1">Last Updated</span>
            <span className="font-medium text-gray-900">{formatDate(instance.updatedAt)}</span>
          </div>
        </div>
        <button
          onClick={handleViewConversation}
          className="w-full inline-flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
        >
          {instance.status === 'active' ? (
            <>
              <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
              Continue Conversation
            </>
          ) : (
            <>
              <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View Conversation
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ConversationCard;