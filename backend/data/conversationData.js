// Predefined conversation template data
export const conversationTemplate = {
  title: "Customer Support Chat",
  description: "Help customers with their inquiries",
  entryNodeKey: "greeting",
  nodes: [
    {
      key: "greeting",
      text: "Hi! Welcome to our support center. How can I help you today?",
      options: [
        {
          key: "product_info",
          label: "Product Information",
          response: "I want to know about your products",
          next: "product_menu"
        },
        {
          key: "order_help",
          label: "Order Help",
          response: "I need help with my order",
          next: "order_support"
        },
        {
          key: "technical_help",
          label: "Technical Support",
          response: "I have a technical issue",
          next: "tech_support"
        },
        {
          key: "other",
          label: "Something Else",
          response: "I have another question",
          next: "other_help"
        }
      ],
      isTerminal: false
    },
    {
      key: "product_menu",
      text: "Great! What would you like to know about our products?",
      options: [
        {
          key: "pricing",
          label: "Pricing",
          response: "Tell me about pricing",
          next: "pricing_info"
        },
        {
          key: "features",
          label: "Features",
          response: "What are the features?",
          next: "features_info"
        },
        {
          key: "back",
          label: "Go Back",
          response: "Go back to main menu",
          next: "greeting"
        }
      ],
      isTerminal: false
    },
    {
      key: "pricing_info",
      text: "Our pricing is simple: Basic plan at $29/month, Pro plan at $79/month, and Enterprise at $199/month. All plans include free support!",
      options: [
        {
          key: "more_info",
          label: "Tell me more",
          response: "I want more details",
          next: "pricing_details"
        },
        {
          key: "enough",
          label: "That's enough",
          response: "Thanks, that's all I needed",
          next: "thank_you"
        }
      ],
      isTerminal: false
    },
    {
      key: "pricing_details",
      text: "Basic includes 1 user and 10GB storage. Pro includes 5 users, 100GB storage, and priority support. Enterprise includes unlimited users, 1TB storage, and dedicated support manager.",
      options: [
        {
          key: "satisfied",
          label: "Perfect, thanks!",
          response: "That's exactly what I needed",
          next: "thank_you"
        },
        {
          key: "back_main",
          label: "Back to Main Menu",
          response: "Let me check other options",
          next: "greeting"
        }
      ],
      isTerminal: false
    },
    {
      key: "features_info",
      text: "Our product features include: Real-time collaboration, Cloud storage, Advanced analytics, Mobile apps, API access, and 24/7 customer support.",
      options: [
        {
          key: "sounds_good",
          label: "Sounds great!",
          response: "That's impressive",
          next: "thank_you"
        },
        {
          key: "back_products",
          label: "Back to Products",
          response: "Show me other product info",
          next: "product_menu"
        }
      ],
      isTerminal: false
    },
    {
      key: "order_support",
      text: "I can help with your order. What do you need?",
      options: [
        {
          key: "track_order",
          label: "Track My Order",
          response: "I want to track my order",
          next: "order_tracking"
        },
        {
          key: "cancel_order",
          label: "Cancel Order",
          response: "I need to cancel my order",
          next: "order_cancel"
        },
        {
          key: "modify_order",
          label: "Modify Order",
          response: "I want to modify my order",
          next: "order_modify"
        },
        {
          key: "back",
          label: "Go Back",
          response: "Go back to main menu",
          next: "greeting"
        }
      ],
      isTerminal: false
    },
    {
      key: "order_tracking",
      text: "Your order #12345 is currently being processed. It will be shipped within 2-3 business days. You'll receive a tracking number via email once shipped.",
      options: [
        {
          key: "thanks",
          label: "Great, thank you!",
          response: "Thanks for the update",
          next: "thank_you"
        },
        {
          key: "more_help",
          label: "I need more help",
          response: "I have another question",
          next: "order_support"
        }
      ],
      isTerminal: false
    },
    {
      key: "order_cancel",
      text: "I can help cancel your order. Please note that once an order is shipped, it cannot be cancelled, but you can return it. Would you like to proceed?",
      options: [
        {
          key: "yes_cancel",
          label: "Yes, cancel it",
          response: "Yes, please cancel my order",
          next: "cancel_confirmed"
        },
        {
          key: "no_cancel",
          label: "No, keep it",
          response: "Actually, keep my order",
          next: "thank_you"
        }
      ],
      isTerminal: false
    },
    {
      key: "cancel_confirmed",
      text: "Your order has been cancelled successfully. A refund will be processed within 5-7 business days to your original payment method.",
      options: [
        {
          key: "done",
          label: "Thank you",
          response: "Thanks for your help",
          next: "thank_you"
        }
      ],
      isTerminal: false
    },
    {
      key: "order_modify",
      text: "To modify your order, please contact our support team at support@company.com or call 1-800-SUPPORT. They'll assist you with any changes.",
      options: [
        {
          key: "ok",
          label: "Okay, got it",
          response: "I'll contact them",
          next: "thank_you"
        },
        {
          key: "back",
          label: "Back to Order Help",
          response: "Show me other options",
          next: "order_support"
        }
      ],
      isTerminal: false
    },
    {
      key: "tech_support",
      text: "I'm here to help with technical issues. What problem are you experiencing?",
      options: [
        {
          key: "login_issue",
          label: "Can't Login",
          response: "I'm having trouble logging in",
          next: "login_help"
        },
        {
          key: "app_issue",
          label: "App Not Working",
          response: "The app isn't working properly",
          next: "app_help"
        },
        {
          key: "other_tech",
          label: "Other Issue",
          response: "Something else isn't working",
          next: "tech_escalate"
        },
        {
          key: "back",
          label: "Go Back",
          response: "Go back to main menu",
          next: "greeting"
        }
      ],
      isTerminal: false
    },
    {
      key: "login_help",
      text: "For login issues, try resetting your password using the 'Forgot Password' link. If that doesn't work, clear your browser cache and try again.",
      options: [
        {
          key: "worked",
          label: "That worked!",
          response: "It's working now",
          next: "thank_you"
        },
        {
          key: "still_issue",
          label: "Still having issues",
          response: "Problem still exists",
          next: "tech_escalate"
        }
      ],
      isTerminal: false
    },
    {
      key: "app_help",
      text: "Try these steps: 1) Update the app to the latest version, 2) Clear app cache, 3) Restart your device. Does this help?",
      options: [
        {
          key: "fixed",
          label: "Yes, it's fixed",
          response: "That solved it",
          next: "thank_you"
        },
        {
          key: "not_fixed",
          label: "No, still broken",
          response: "Still not working",
          next: "tech_escalate"
        }
      ],
      isTerminal: false
    },
    {
      key: "tech_escalate",
      text: "I'll escalate this to our technical team. They'll reach out to you within 24 hours at your registered email. Is there anything else I can help with?",
      options: [
        {
          key: "no_thanks",
          label: "No, that's all",
          response: "No, thank you",
          next: "thank_you"
        },
        {
          key: "yes_more",
          label: "Yes, something else",
          response: "I have another question",
          next: "greeting"
        }
      ],
      isTerminal: false
    },
    {
      key: "other_help",
      text: "I understand you have a different question. For complex inquiries, our team can assist you better. Would you like to be connected with a human agent?",
      options: [
        {
          key: "yes_agent",
          label: "Yes, connect me",
          response: "Yes, I'd like to speak with someone",
          next: "agent_transfer"
        },
        {
          key: "no_agent",
          label: "No, I'm okay",
          response: "No, that's fine",
          next: "thank_you"
        },
        {
          key: "back",
          label: "Back to Main Menu",
          response: "Let me check the menu again",
          next: "greeting"
        }
      ],
      isTerminal: false
    },
    {
      key: "agent_transfer",
      text: "Connecting you to a human agent. Average wait time is 5 minutes. A support representative will be with you shortly. Thank you for your patience!",
      options: [
        {
          key: "ok_wait",
          label: "Okay, I'll wait",
          response: "I'll wait for an agent",
          next: "thank_you"
        }
      ],
      isTerminal: false
    },
    {
      key: "thank_you",
      text: "Thank you for contacting us! Is there anything else I can help you with?",
      options: [
        {
          key: "yes_more",
          label: "Yes, I have more questions",
          response: "Yes, I need more help",
          next: "greeting"
        },
        {
          key: "no_done",
          label: "No, I'm all set",
          response: "No, that's everything. Thank you!",
          next: "goodbye"
        }
      ],
      isTerminal: false
    },
    {
      key: "goodbye",
      text: "You're welcome! Have a wonderful day! Feel free to reach out anytime. Goodbye! 👋",
      options: [],
      isTerminal: true
    }
  ],
  metadata: {
    category: "customer_support",
    version: "1.0",
    createdBy: "system"
  }
};
