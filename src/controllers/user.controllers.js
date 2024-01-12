import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/data.models.js";
import { cloudinaryFilehander } from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(
            500,
            "Something went wrong while generating refresh and access token"
        );
    }
};
const registerUser = asyncHandler(async (req, res) => {
    //getting the info from the postman
    // Validation - confirming the the field is not empty
    //checking the user is already exists or not - username and email
    //check the files is there or not - Avatar
    //upload them to cloudinary
    //create user object - create entry in DB
    //remove password and refresh token from response
    //check from user creation
    //return res

    const { fullname, email, username, password } = req.body;
    console.log("email :", email);

    // if(fullname=== "")
    // {
    //     throw new ApiError(400,"fullname is rquired")
    // }

    if (
        [fullname, email, username, password].some((field) => {
            field?.trim() === "";
        })
    ) {
        throw new ApiError(400, "fullname is rquired");
    }
    const existedUser = await User.findOne({
        $or: [{ email }, { username }],
    });
    if (existedUser) {
        throw new ApiError(
            409,
            "user with the same email or username already exists"
        );
    }
    console.log(req.files);
    const avatarLocalPath = req.files?.avatar[0]?.path;
    let coverImageLocalPath;

    if (
        req.files &&
        Array.isArray(req.files.coverImage) &&
        req.files.coverImage.length > 0
    ) {
        coverImageLocalPath = req.files.coverImage[0].path;
    }

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is mandatory");
    }
    const avatar = await cloudinaryFilehander(avatarLocalPath);
    const coverImage = await cloudinaryFilehander(coverImageLocalPath);

    if (!avatar) {
        throw new ApiError(400, "Avatar is mandatory");
    }
    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase(),
    });
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if (!createdUser) {
        throw new ApiError(
            500,
            "Something went wrong while Registering the user"
        );
    }
    return res
        .status(201)
        .json(
            new ApiResponse(200, createdUser, "User registered successfully")
        );
});
const loginUser = asyncHandler(async (req, res) => {
    // reqbody -> Data
    // useranme or email
    //search for the existing user
    // match the password
    //access or refresh token
    //send cookies

    const { email, username, password } = req.body;
    if (!username || !email) {
        throw new ApiError(400, "username or password is required");
    }
    const user = await User.findOne({
        $or: [{ username }, { email }],
    });
    if (!user) {
        throw new ApiError(400, "User doesnot Exist");
    }
    const isPasswordValid = user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid User Credentials");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
        user._id
    );
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
    const options={
        httpOnly:true,
        secure:true
    }
    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,
            {
                user:loggedInUser,accessToken,refreshToken
            },
            "User logged-in Successfully"
        )
    )
});

const logoutUser = asyncHandler(async (req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:[{refreshToken:undefined}]
        },
        {
            new:true
        }
    )
    const options={
        httpOnly:true,
        secure:true
    }
    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(
        new ApiResponse(
            200,
            {
                
            },
            "User logged-out Successfully"
        )
    )

})
export { registerUser,loginUser,logoutUser };
