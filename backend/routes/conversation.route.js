import express from 'express';
import {
  createTemplate,
  getTemplate,
  listTemplates,
  startInstance,
  getInstance,
  chooseOption,
  listInstances,
  softDeleteInstance
} from '../controllers/converastionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// template management
router.post('/templates', protect, createTemplate);
router.get('/templates', protect, listTemplates);
router.get('/templates/:id', protect, getTemplate);

// instance lifecycle
router.post('/instances', protect, startInstance);           // { templateId, participants, metadata }
router.get('/instances', protect, listInstances);
router.get('/instances/:id', protect, getInstance);
router.post('/instances/:id/choose', protect, chooseOption); // { optionKey }
router.delete('/instances/:id', protect, softDeleteInstance);

export default router;