import express  from'express'
import {
    getProfile,
    deleteProfile,
    addorEditProfile,
    addFollowedtoProfile,
    deleteFollowedtoProfile
} from'../controllers/apiProfileController.js'

const router = express.Router();
router.get('/profile',getProfile)

router.delete('/profile',deleteProfile)

router.post('/profile',addorEditProfile)

router.post('/profile/follow',addFollowedtoProfile)
router.delete('/profile/unfollow',deleteFollowedtoProfile)
export default router