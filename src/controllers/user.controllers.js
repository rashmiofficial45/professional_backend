import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/data.models.js";
import { cloudinaryFilehander } from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        console.log(error);
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
    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );
    const options = {
        httpOnly: true,
        secure: true,
    };
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken,
                },
                "User logged-in Successfully"
            )
        );
});

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: { refreshToken: undefined },
        },
        {
            new: true,
        }
    );
    const options = {
        httpOnly: true,
        secure: true,
    };
    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged-out Successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    try {
        const incomingRefreshToken =
            req.cookies.refreshToken || req.body.refreshToken;
        if (!incomingRefreshToken) {
            throw new ApiError(401, "Unauthorized Access");
        }
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const user = await User.findById(decodedToken?._id);
        if (!user) {
            throw new ApiError(401, "Invalid Reference");
        }
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired and used");
        }
        const options = {
            httpOnly: true,
            secure: true,
        };
        const { accessToken, newRefreshToken } =
            await generateAccessAndRefreshTokens(user._id);
        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    {
                        accessToken,
                        refreshToken: newRefreshToken,
                    },
                    "Access token refreshed"
                )
            );
    } catch (error) {
        throw new ApiResponse(401, error?.message || "Invalid refresh token");
    }
});
const changeCurrentPassword = asyncHandler(async () => {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user?._id);
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid password");
    }
    user.password = newPassword;
    await user.save({ validateBeforeSave: false });
    return res
        .status(200)
        .json(new ApiResponse(200, {}, "password changed successfully"));
});
const getCurrentUser = asyncHandler(async () => {
    return res
        .status(200)
        .json(new ApiResponse(200, {}, "coverImage updated sucessfully"));
});
const updateAccountDetails = asyncHandler(async () => {
    const { fullname, email } = req.body;
    if (!(fullname || email)) {
        throw new ApiError(400, "All the fields are required");
    }
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullname,
                email: email,
            },
        },
        {
            new: true,
        }
    ).select("-password");
    return res
        .status(200)
        .json(
            new ApiResponse(200, user, "Account Details Updated Successfully")
        );
});

const updateUserAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path;
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing");
    }
    const avatar = await cloudinaryFilehander(avatarLocalPath);

    if (!avatar.url) {
        throw new ApiError(400, "Eroor while uploading on Avatar");
    }
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: avatar.url,
            },
        },
        {
            new: true,
        }
    );
    return res
        .status(200)
        .json(new ApiResponse(200, user, "avatar Image updated sucessfully"));
});
const updateUserCoverImage = asyncHandler(async (req, res) => {
    const coverLocalPath = req.file?.path;
    if (!coverLocalPath) {
        throw new ApiError(400, "Cover Image is missing");
    }
    const coverImage = await cloudinaryFilehander(coverLocalPath);

    if (!coverImage.url) {
        throw new ApiError(400, "Eroor while uploading on coverImage");
    }
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                coverImage: coverImage.url,
            },
        },
        {
            new: true,
        }
    );
    return res
        .status(200)
        .json(new ApiResponse(200, user, "coverImage updated sucessfully"));
});
export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage
};
