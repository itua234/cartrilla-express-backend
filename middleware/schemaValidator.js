const Joi = require('joi');
const Schemas = require('../schemas');

module.exports = (useJoiError = false) => {
    const _useJoiError = _.isBoolean(useJoiError) && useJoiError;

    const _supportedMethods = ['post', 'put'];

    const _validationOptions = {
        abortEarly: false,
        allowUnknown: true,
        stripUnknown: true
    };

    //return the validation middleware
    return (req, res, next) => {
        const route = req.route.path;
        const method = req.method.toLowerCase();

        if(_.includes(_supportedMethods, method) && _.has(Schemas, route)) {
            //get schema for the current route
            const _schema = _.get(Schemas, route);

            if(_schema){
                //validate req.body using the schema and validation options
                return Joi.validate(req.body, _schema, _validationOptions, (err, data) => {
                    if(err){
                        //Joi error
                        const JoiError = {
                            status: 'failed',
                            error: {
                                original: err._object,
                                //fetch only message and type from each other
                                details: _.map(err.details, ({message, type}) => ({
                                    message: message.replace(/['"]/g, ''),
                                    type
                                }))
                            }
                        };

                        //Custom Error
                        const customError = {
                            status: 'failed',
                            error: 'Invalid request data. Please review request and try again.'
                        };

                        //send back the JSON error response
                        res.status(422).json(_useJoiError ? JoiError : CustomError);
                    }else{
                        //replace the req.body with the data after Joi validation
                        req.body = data;
                        next();
                    }
                });
            }
        }
        next();
    }
}