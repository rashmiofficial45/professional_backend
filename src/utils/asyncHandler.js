const asyncHandler=(requestHandler)=>{
    return (req,res,next)=>{
    // Resolve the promise returned by the request handler and handle any rejections
    Promise.resolve(requestHandler(req,res,next))
    .catch((err)=>next(err))
}
}
export {asyncHandler}

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

/*
!const asyncHandler = (requestHandler) => {:
?This line defines a function named asyncHandler that takes a single parameter, requestHandler. This parameter is expected to be a function that handles asynchronous requests.


!return (req, res, next) => {:
?The asyncHandler function returns another function, which is a middleware function typically used in an Express.js application.
?This middleware function takes three parameters: req (request), res (response), and next (the next middleware in the chain).


!Promise.resolve(requestHandler(req, res, next)):
?It calls the requestHandler function with the provided req, res, and next parameters. The result of this function call is expected to be a promise.
?Promise.resolve is used to ensure that the result is wrapped in a promise, allowing consistent handling of both synchronous and asynchronous code.


!.catch((err) => next(err));:
?If there is any rejection (an error) in the resolved promise, it catches the error and passes it to the next function. This is a common pattern in Express.js to propagate errors to the error-handling middleware.


!};:
?Closes the middleware function.


!export { asyncHandler };:
?Exports the asyncHandler function for use in other modules.


*In summary, the asyncHandler function is a middleware wrapper that takes an asynchronous request handler as input and returns a middleware function. This middleware function ensures that any promises returned by the original requestHandler are properly resolved and handles errors by passing them to the next middleware in the chain. This is particularly useful for simplifying error handling in asynchronous Express.js route handlers.
*/

