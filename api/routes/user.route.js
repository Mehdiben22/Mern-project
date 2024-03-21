//Best practices
import express from 'express'
import { getUser, test } from '../controllers/user.controller.js'
import { updateUser } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';
import { deleteUser } from '../controllers/user.controller.js';
import { signout } from '../controllers/user.controller.js';
import { getUsers } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/test', test );
//When the token is verified the user is gona be added to the req and we will go to the next function update 
router.put('/update/:userId', verifyToken, updateUser);
router.delete('/delete/:userId' , verifyToken,deleteUser);
router.post('/signout', signout);
// This api route is for admin 
router.get('/getusers', verifyToken , getUsers);
router.get('/:userId' , getUser)

export default router;