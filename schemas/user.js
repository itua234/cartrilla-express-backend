const Joi = require('joi');
//export the schemas
module.exports = {
    userProfileSchema: (req, res, next) => {
        const schema = Joi.object({
            firstname: Joi.string().min(3).required(),
            lastname: Joi.string().min(3).required(),
            email: Joi.string().email({
                minDomainSegments: 2,
                tlds: {
                    allow: ['com', 'net']
                }
            }).required()
        }).options({abortEarly: false});

        const {error, value} = schema.validate(req.body);
        if(error){
            var check = {}
            let details = error.details;
            var obj;
            var array = []; 
            details.forEach((err) => {
                var key = err.path[0];
                var msg = err.message
                var message = msg.replaceAll("\"", '');
                if(array.includes(key)){
                    obj[key].push(message);
                }else{
                    obj = Object.assign(check, {[key]: [message]});
                }
                array.push(key);
            });
            return res.status(422).json({
                message: error.details[0].message,
                error: obj,
            });
        }else{
            if(!req.value){
                req.value = {}
            }
            req.body = value;
            next();
        }
    }
}