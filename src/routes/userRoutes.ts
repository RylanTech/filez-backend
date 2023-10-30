import { Router } from 'express';
import { allUser, createUser, deleteUser, getUser, modifyUser, signInUser, verifyCurrentUser } from '../controllers/userController';

const router = Router();

router.get('/', allUser);

router.get('/:id', getUser);

router.post('/create-account', createUser);

router.put('/edit-account/:id', modifyUser);

router.post('/signin', signInUser);

router.delete('/delete-account/:id', deleteUser);

router.get("/verify-current-user", verifyCurrentUser);

export default router; 
