import {Router} from "express"
import { loginUser, logoutUser, refreshAccessToken, registerUser ,updateUserAvatar,getCurrentUser ,changeCurrentPassword , updateAccountDetails } from "../controllers/user.controllers.js"
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
router.route("/change-password").post(verifyJwt,changeCurrentPassword)  //?Still having Error
router.route("/change-email").post(verifyJwt,updateAccountDetails)
router.route("/currentuser").post(verifyJwt,getCurrentUser)
router.route("/updateavatar").post(verifyJwt,updateUserAvatar)
export default router