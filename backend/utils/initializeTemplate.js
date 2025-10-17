import { SelectionConversationTemplate } from '../models/conversation.model.js';
import { conversationTemplate } from '../data/conversationData.js';

export const initializeTemplate = async () => {
  try {
    // Check if template already exists
    const existingTemplate = await SelectionConversationTemplate.findOne({ 
      title: conversationTemplate.title 
    });

    if (!existingTemplate) {
      // Create the template if it doesn't exist
      const template = new SelectionConversationTemplate(conversationTemplate);
      await template.save();
      console.log('✅ Conversation template initialized successfully');
    } else {
      console.log('✅ Conversation template already exists');
    }
  } catch (error) {
    console.error('❌ Error initializing conversation template:', error);
  }
};
