import { Router } from 'express';
import { getFileDetails } from '../controllers/filezController';
const router = Router();

router.get('/', getFileDetails);

export default router;