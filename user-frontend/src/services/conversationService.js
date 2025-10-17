import api from './api';

// Templates
export const getTemplates = async () => {
  try {
    const response = await api.get('/conversations/templates');
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response?.data?.message || 'Failed to fetch templates' };
  }
};

export const getTemplate = async (id) => {
  try {
    const response = await api.get(`/conversations/templates/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response?.data?.message || 'Failed to fetch template' };
  }
};

// Instances
export const getInstances = async () => {
  try {
    const response = await api.get('/conversations/instances');
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response?.data?.message || 'Failed to fetch instances' };
  }
};

export const getInstance = async (id) => {
  try {
    const response = await api.get(`/conversations/instances/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response?.data?.message || 'Failed to fetch instance' };
  }
};

export const startInstance = async (templateId) => {
  try {
    const response = await api.post('/conversations/instances', { templateId });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response?.data?.message || 'Failed to start conversation' };
  }
};

export const chooseOption = async (instanceId, optionKey) => {
  try {
    const response = await api.post(`/conversations/instances/${instanceId}/choose`, { optionKey });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response?.data?.message || 'Failed to select option' };
  }
};

export const deleteInstance = async (id) => {
  try {
    const response = await api.delete(`/conversations/instances/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response?.data?.message || 'Failed to delete instance' };
  }
};