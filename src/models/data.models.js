import mongoose,{Schema}from "mongoose"
import jwt from "jsonwebtoken"
import bcryptjs from "bcryptjs"
const userSchema=new Schema(
    {
        username:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
            index:true
        },
        email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
        },
        fullname:{
            type:String,
            required:true,
            trim:true,
            index:true
        },
        avatar:{
            type:String, //cloudinary url
            required:true,
        },
        coverImage:{
            type:String, //cloudinary url
        },
        watchHistory:{
            type:Schema.Types.ObjectId,
            ref:"Video",
        },
        password:{
            type:String,
            required:[true,"password is required"]
        },
        refreshToken:{
            type:String,  
        }

    },{
        timestamps:true
    }
)
userSchema.pre('save', async function(next) {
    if (!this.isModified("password")) return next();
    this.password=await bcryptjs.hash(this.password,10)
    next();
})

userSchema.methods.isPasswordCorrect = async function(password){
    try {
        // Check if password is undefined
        if (!password || !this.password) {
          return false;
        }
        const isMatch = await bcryptjs.compare(password, this.password);
        return isMatch;
      } catch (error) {
        // Handle any errors that might occur during the comparison
        console.error("Error in password comparison:", error);
        return false;
      }}

userSchema.methods.generateAccessToken =  function(){
    return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            username:this.username,
            fullname:this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    ) 
}
userSchema.methods.generateRefreshToken =  function(){
    return jwt.sign(
        {
            _id:this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,{
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    ) 
}
export const User=mongoose.model("User",userSchema)