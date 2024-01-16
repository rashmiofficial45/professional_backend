import mongoose , {Schema} from "mongoose"
const subscriptionSchema = new Schema({
    subscriber:{
        type:Schema.Types.ObjectId,
        ref:"User"   //One who is subscribing
    },
    channel:{
        type:Schema.Types.ObjectId,
        ref:"User"   //One to whom the subscriber is subscribing
    },
},{timestamps:true})

export const Subscription = mongoose.model("Subscription",subscriptionSchema)