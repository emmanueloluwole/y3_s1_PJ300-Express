import express, { Router } from 'express';
import {
  getDesigns,
  getDesignById,
  createDesign,
  updateDesign,
  deleteDesign,
} from '../controllers/designs';

const router: Router = express.Router();

router.get('/', getDesigns);
router.get('/:id', getDesignById);
router.post('/', createDesign);
router.put('/:id', updateDesign);
router.delete('/:id', deleteDesign);

export default router;
