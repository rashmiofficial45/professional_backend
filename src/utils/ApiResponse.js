
//!syntax --> throw new ApiResponse(200,{data to be sent},"message")

class ApiResponse {
    constructor(statusCode,data,message="Success"){
         // Assign the provided status code to the instance property
        this.statusCode = statusCode;

        // Assign the provided data to the instance property
        this.data = data;

        // Assign the provided message to the instance property, defaulting to "Success" if not provided
        this.message = message;

        // Determine the success status based on the HTTP status code (assuming status codes below 400 indicate success)
        this.success = statusCode < 400;
    }
}
export default ApiResponse

/*
!constructor(statusCode, data, message = "Success"):
?This is the constructor method of the ApiResponse class.
?It takes three parameters: statusCode, data, and an optional message.
?If message is not provided, it defaults to "Success".


!this.statusCode = statusCode;:
?Assigns the provided statusCode parameter to the statusCode property of the ApiResponse instance.


!this.data = data;:
?Assigns the provided data parameter to the data property of the ApiResponse instance. This could be any data returned by the API.


!this.message = message;:
?Assigns the provided message parameter to the message property of the ApiResponse instance. This is a human-readable message associated with the response.


!this.success = statusCode < 400;:
?Calculates the success property based on whether the statusCode is less than 400. This assumes that HTTP status codes below 400 indicate success, and status codes 400 and above indicate an error. The success property is a boolean.


!export default ApiResponse;:
?Exports the ApiResponse class to make it available for use in other modules.
*/