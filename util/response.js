class Response{

    coreResponse = (message, data = null, statusCode, isSuccess = true) => 
    {
        // Check the params
        if(!message) return res.status(500).json({message: 'Message is required'})

        // Send the response
        if(isSuccess){
            res.json(statusCode).json({
                'message': message,
                'results': data,
                'error': false,
            });
        }else{
            res.json(statusCode).json({
                'message': message,
                'error': true,
            });
        }
    }

    success = (message, data, statusCode = 200) => 
    {
        return this.coreResponse(message, data, statusCode);
    }

    error = (message, statusCode = 500) => 
    {
        return this.coreResponse(message, null, statusCode, false);
    }

}

module.exports = {Response: Response};

