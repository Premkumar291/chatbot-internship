import { useNavigate } from 'react-router-dom';

const ConversationCard = ({ instance }) => {
  const navigate = useNavigate();
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleViewConversation = () => {
    navigate(`/conversation/${instance._id}`);
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
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {instance.template?.title || 'Conversation'}
          </h3>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(instance.status)}`}>
            {instance.status}
          </span>
        </div>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          {instance.template?.description || 'No description'}
        </p>
      </div>
      <div className="border-t border-gray-200 px-4 py-4 sm:px-6">
        <div className="flex flex-wrap gap-2">
          <div className="text-sm">
            <span className="text-gray-500">Started: </span>
            <span className="font-medium text-gray-900">{formatDate(instance.createdAt)}</span>
          </div>
          <div className="text-sm">
            <span className="text-gray-500">Updated: </span>
            <span className="font-medium text-gray-900">{formatDate(instance.updatedAt)}</span>
          </div>
        </div>
        <div className="mt-4">
          <button
            onClick={handleViewConversation}
            className="w-full inline-flex justify-center items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {instance.status === 'active' ? 'Continue' : 'View'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConversationCard;