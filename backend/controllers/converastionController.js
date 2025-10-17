import mongoose from 'mongoose';
import { SelectionConversationTemplate, SelectionConversationInstance } from '../models/conversation.model.js';


export const createTemplate = async (req, res, next) => {
  try {
    const data = req.body;
    const tpl = new SelectionConversationTemplate(data);
    await tpl.save();
    return res.status(201).json(tpl);
  } catch (err) { next(err); }
};

export const getTemplate = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });
    const tpl = await SelectionConversationTemplate.findById(id);
    if (!tpl) return res.status(404).json({ message: 'Template not found' });
    return res.json(tpl);
  } catch (err) { next(err); }
};

export const listTemplates = async (req, res, next) => {
  try {
    const templates = await SelectionConversationTemplate.find().sort({ createdAt: -1 });
    return res.json(templates);
  } catch (err) { next(err); }
};


export const startInstance = async (req, res, next) => {
  try {
    const { templateId, metadata } = req.body;
    if (!mongoose.Types.ObjectId.isValid(templateId)) return res.status(400).json({ message: 'Invalid templateId' });
    const tpl = await SelectionConversationTemplate.findById(templateId);
    if (!tpl) return res.status(404).json({ message: 'Template not found' });

    const entry = tpl.entryNodeKey || (tpl.nodes.length ? tpl.nodes[0].key : null);
    if (!entry) return res.status(400).json({ message: 'Template has no entry node' });

    // Add the authenticated user to participants
    const instance = new SelectionConversationInstance({
      template: tpl._id,
      participants: [req.user.id], // User from auth middleware
      currentNodeKey: entry,
      metadata: { ...metadata, userId: req.user.id }
    });
    await instance.save();
    return res.status(201).json(instance);
  } catch (err) { next(err); }
};

export const getInstance = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });
    
    // Find instance and check if user is a participant
    const inst = await SelectionConversationInstance.findById(id).populate('template');
    if (!inst) return res.status(404).json({ message: 'Instance not found' });
    
    // Check if the user is a participant in this conversation
    const isParticipant = inst.participants.some(p => p.toString() === req.user.id.toString());
    if (!isParticipant) {
      return res.status(403).json({ message: 'Access denied. You are not a participant in this conversation.' });
    }
    
    return res.json(inst);
  } catch (err) { next(err); }
};


export const chooseOption = async (req, res, next) => {
  try {
    const { id } = req.params; // instance id
    const { optionKey } = req.body;
    if (!optionKey) return res.status(400).json({ message: 'optionKey is required' });
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });

    // load instance + template
    const inst = await SelectionConversationInstance.findById(id);
    if (!inst) return res.status(404).json({ message: 'Instance not found' });
    
    // Check if the user is a participant
    const isParticipant = inst.participants.some(p => p.toString() === req.user.id.toString());
    if (!isParticipant) {
      return res.status(403).json({ message: 'Access denied. You are not a participant in this conversation.' });
    }
    
    if (inst.status !== 'active') return res.status(400).json({ message: `Instance not active: ${inst.status}` });

    const tpl = await SelectionConversationTemplate.findById(inst.template);
    if (!tpl) return res.status(500).json({ message: 'Template missing for instance' });

    const node = tpl.nodes.find(n => n.key === inst.currentNodeKey);
    if (!node) return res.status(400).json({ message: 'Current node not found in template' });

    const opt = node.options.find(o => o.key === optionKey);
    if (!opt) return res.status(400).json({ message: 'Option not found at current node' });

    // append history and advance
    inst.history.push({
      nodeKey: node.key,
      optionKey: opt.key,
      response: opt.response
    });

    inst.currentNodeKey = opt.next || null;
    if (!inst.currentNodeKey || (tpl.nodes.find(n => n.key === inst.currentNodeKey)?.isTerminal)) {
      inst.status = 'completed';
    }

    await inst.save();

    return res.json({ instance: inst, systemMessage: opt.response });
  } catch (err) { next(err); }
};

export const listInstances = async (req, res, next) => {
  try {
    // Filter instances to show only those where the user is a participant
    const q = { 
      status: { $ne: 'deleted' },
      participants: req.user.id // Only show user's own conversations
    };
    
    const items = await SelectionConversationInstance.find(q)
      .populate('template')
      .sort({ updatedAt: -1 })
      .limit(100);
    return res.json(items);
  } catch (err) { next(err); }
};

export const softDeleteInstance = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });
    
    // Find the instance first to check ownership
    const inst = await SelectionConversationInstance.findById(id);
    if (!inst) return res.status(404).json({ message: 'Instance not found' });
    
    // Check if the user is a participant
    const isParticipant = inst.participants.some(p => p.toString() === req.user.id.toString());
    if (!isParticipant) {
      return res.status(403).json({ message: 'Access denied. You cannot delete this conversation.' });
    }
    
    // Update status to deleted
    inst.status = 'deleted';
    await inst.save();
    
    return res.json({ message: 'deleted', id: inst._id });
  } catch (err) { next(err); }
};