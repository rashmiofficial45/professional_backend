import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {User} from "../models/data.models.js";
import {cloudinaryFilehander} from "../utils/cloudinary.js"
import ApiResponse from "../utils/ApiResponse.js";
const registerUser = asyncHandler( async (req,res)=>{
    //getting the info from the postman
    // Validation - confirming the the field is not empty
    //checking the user is already exists or not - username and email
    //check the files is there or not - Avatar       
    //upload them to cloudinary
    //create user object - create entry in DB
    //remove password and refresh token from response
    //check from user creation 
    //return res  
    
    const { fullname , email , username , password}= req.body
    console.log("email :",email);

    // if(fullname=== "")
    // {
    //     throw new ApiError(400,"fullname is rquired")
    // }

    if (
        [fullname,email,username,password].some((field)=>{
            field?.trim()===""
        })
    )
    {
        throw new ApiError(400,"fullname is rquired")

    }
    const existedUser=User.findOne({
        $or:[{ email },{ username }]
    })
    if (existedUser){
        throw new ApiError(409,"user with the same email or username already exists")
    }
    console.log(req.files);
    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverImageLocalPath = req.files?.coverImage[0]?.path

    if (!avatarLocalPath) {
        throw new ApiError(400 , "Avatar is mandatory")
    }
    const avatar = await cloudinaryFilehander(avatarLocalPath)
    const coverImage = await cloudinaryFilehander(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400 , "Avatar is mandatory")
    }
    const user = await User.create({
        fullname,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        email,
        password,
        username:username.toLowerCase()

    })
    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if (!createdUser){
        throw new ApiError(500 , "Something went wrong while Registering the user")
    }
    return res.status(201).json(
        new ApiResponse(200,createdUser,"User registered successfully")
    )
} )
export {registerUser}