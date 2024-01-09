import mongoose,{Schema}from "mongoose"
// import mongooseAgreegatePaginate from "mongoose-aggregate-paginate-v2"
const videoSchema=new Schema(
    {
        videoFile:{
            type:String, //Cloudinary url
            required:true,
        },
        thumbnail:{
            type:String, //Cloudinary url
            required:true,
        },
        owner:{
            type:Schema.Types.ObjectId,
            ref:"User",
            required:true,
        },
        title:{
            type:String,
            required:true,
        },
        description:{
            type:String,
            required:true,
        },
        duration:{
            type:Number, //Cloudinary url
            required:true,
        },
        views:{
            type:Number,
            default:0,
            required:true,
        },
        isPublished:{
            type:Boolean,
            default:true,
        },
    },
    {
        timestamps:true
    }
)

    // videoSchema.plugin
export const Video=mongoose.model("Video",videoSchema)