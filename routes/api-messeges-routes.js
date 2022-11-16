import express from'express'
import {
  createOrGetRoom,
  getAllRooms,
  addUsersToRoom
} from '../controllers/apiMessageController.js'

const router = express.Router();

router.get('/messages/create', createOrGetRoom);
router.post('/messages', addUsersToRoom);
router.get('/messages/', getAllRooms);
export default router;
