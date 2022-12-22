import express from'express'
import { body, check } from 'express-validator';
import {
  createOrGetRoom,
  getAllRooms,
  addUsersToRoom,
  renameRoom
} from '../controllers/apiMessageController.js'

const router = express.Router();

router.get('/messages/create', createOrGetRoom);
router.post('/messages', addUsersToRoom);
router.get('/messages/', getAllRooms);
router.post('/messages/renameRoom',
body('roomId').not().isEmpty().trim().escape(),
body('roomName').not().isEmpty().trim().escape(),
check('roomName','length of roomName must be > 2 , < 40').isLength({min:2,max:40}),
renameRoom);
export default router;
