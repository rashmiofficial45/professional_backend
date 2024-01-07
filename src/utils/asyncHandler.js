const asyncHandler=(requestHandler)=>(req,res,next)=>{
    Promise.resolve(requestHandler(req,res,next))
    .catch((err)=>next(err))

}









//One way is the Below and the other and Good way is the above
/*
const asyncHandler=(fn)=> async (req,res,next)=>{
    try {
        await fn(req,res,next)
    } catch (err) {
        res.status(err.code || 500).json({
            success:false,
            message:err,message

        })
    }
}
*/


export {asyncHandler}