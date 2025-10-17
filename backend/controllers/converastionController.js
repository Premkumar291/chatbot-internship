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
    const { templateId, participants = [], metadata } = req.body;
    if (!mongoose.Types.ObjectId.isValid(templateId)) return res.status(400).json({ message: 'Invalid templateId' });
    const tpl = await SelectionConversationTemplate.findById(templateId);
    if (!tpl) return res.status(404).json({ message: 'Template not found' });

    const entry = tpl.entryNodeKey || (tpl.nodes.length ? tpl.nodes[0].key : null);
    if (!entry) return res.status(400).json({ message: 'Template has no entry node' });

    const instance = new SelectionConversationInstance({
      template: tpl._id,
      participants,
      currentNodeKey: entry,
      metadata
    });
    await instance.save();
    return res.status(201).json(instance);
  } catch (err) { next(err); }
};

export const getInstance = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });
    const inst = await SelectionConversationInstance.findById(id).populate('template');
    if (!inst) return res.status(404).json({ message: 'Instance not found' });
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
    const q = { status: { $ne: 'deleted' } };
    if (req.query.participant) q.participants = req.query.participant;
    const items = await SelectionConversationInstance.find(q).sort({ updatedAt: -1 }).limit(100);
    return res.json(items);
  } catch (err) { next(err); }
};

export const softDeleteInstance = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });
    const inst = await SelectionConversationInstance.findByIdAndUpdate(id, { status: 'deleted' }, { new: true });
    if (!inst) return res.status(404).json({ message: 'Instance not found' });
    return res.json({ message: 'deleted', id: inst._id });
  } catch (err) { next(err); }
};