//!Custom Error class for handling API errors with status code, message, and optional error details.
class ApiError extends Error{
    constructor(
        statusCode,
        message="Something went Wrong",
        errors=[],
        stack=""

    ){
        super(message)
           // Assign properties specific to ApiError
            this.statusCode = statusCode;
            this.data = null; // Additional data, if needed
            this.message = message;
            this.success = false; // Indicates that the operation was not successful
            this.errors = errors;

            // Assign stack trace if provided, otherwise capture it
            if (stack) {
                this.stack = stack;
            } 
            else 
            {
                Error.captureStackTrace(this, this.constructor);
            }
    }
}
export {ApiError}

/* 
!constructor(statusCode, message = "Something went Wrong", errors = [], stack = ""):

?This is the constructor method of the ApiError class.
?It takes four parameters: statusCode, message, errors, and stack. All of these parameters have default values assigned.


!super(message);:
?super is used to call the constructor of the parent class (Error in this case).
?The message parameter is passed to the Error constructor, which sets the error message for the instance.


!this.statusCode = statusCode;:
?Assigns the provided statusCode parameter to the statusCode property of the ApiError instance.


!this.data = null;:
?Initializes the data property to null. You can use this property to store additional data if needed.


!this.message = message;:
?Assigns the provided message parameter to the message property of the ApiError instance.


!this.success = false;:
?Initializes the success property to false. This property could be used to indicate whether an operation was successful.


!this.errors = errors;:
?Assigns the provided errors parameter (an array of additional error details) to the errors property.


!if (stack) { this.stack = stack; } else { Error.captureStackTrace(this, this.constructor); }:
?Checks if a stack parameter is provided. If yes, it assigns it to the stack property of the instance.
?If not, it captures the stack trace using Error.captureStackTrace, which is a method that captures the stack trace at the point where the constructor is called. This is useful for debugging.
*/