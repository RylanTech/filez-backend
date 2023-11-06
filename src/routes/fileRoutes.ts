import { Router } from 'express';
import { deleteArray, getFileDetails } from '../controllers/filezController';
const router = Router();

router.get('/', getFileDetails);
router.post('/deletearr', deleteArray)

export default router;