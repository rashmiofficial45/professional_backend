import {Router} from "express"
import { loginUser, logoutUser, refreshAccessToken, registerUser ,updateUserAvatar,getCurrentUser ,changeCurrentPassword , updateAccountDetails, updateUserCoverImage, getUserChannelProfile, getWatchHistory } from "../controllers/user.controllers.js"
import {upload} from "../middlewares/multer.middlewares.js" 
import { verifyJwt } from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ]),
    registerUser
    )

router.route("/login").post(loginUser)
router.route("/logout").post(verifyJwt,logoutUser)
router.route("/refresh-token").post(verifyJwt,refreshAccessToken)
router.route("/currentuser").get(verifyJwt,getCurrentUser)
router.route("/change-password").post(verifyJwt,changeCurrentPassword)  //?Still having Error
router.route("/change-email").patch(verifyJwt,updateAccountDetails)
router.route("/updateavatar").patch(verifyJwt,upload.single("avatar"),updateUserAvatar)
router.route("/updatecoverimage").patch(verifyJwt,upload.single("coverImage"),updateUserCoverImage)
router.route("/c/:username").get(verifyJwt,getUserChannelProfile)
router.route("/history").get(verifyJwt,getWatchHistory)
export default router