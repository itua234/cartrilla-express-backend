const Joi = require('joi');
//export the schemas
module.exports = {
    registerSchema: (req, res, next) => {
        const schema = Joi.object({
            firstname: Joi.string().min(3).required(),
            lastname: Joi.string().min(3).required(),
            email: Joi.string().email({
                minDomainSegments: 2,
                tlds: {
                    allow: ['com', 'net']
                }
            }).required(),
            phone: Joi.number().required(),
            password: Joi.string().min(8).required(),
            password_confirmation: Joi.string().valid(Joi.ref('password')).required().error(errors => {
                errors.forEach(err => {
                    if(err.code === 'any.only'){
                        err.message = 'Password and Confirm Password do not match'
                    }
                });
                return errors;
            })
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
    },

    loginSchema: (req, res, next) => {
        const schema = Joi.object({
            email: Joi.string().email({
                minDomainSegments: 2,
                tlds: {
                    allow: ['com', 'net']
                }
            }).required(),
            password: Joi.string().min(8).required()
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
            // return res.status(422).json({
            //     message: error.details[0].message,
            //     error: error.details
            // });
        }else{
            if(!req.value){
                req.value = {}
            }
            req.body = value;
            next();
        }
    },

    verifyEmailSchema: (req, res, next) => {
        const schema = Joi.object({
            email: Joi.required(),
            code: Joi.required()
        }).options({abortEarly: false});
        const options = {
            abortEarly: false,
            allowUnknown: false,
            stripUnknown: true
        };
        const {error, value} = schema.validate(req.params);
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
    },

    forgotPasswordSchema: (req, res, next) => {
        const schema = Joi.object({
            email: Joi.string().email({
                minDomainSegments: 2,
                tlds: {
                    allow: ['com', 'net']
                }
            }).required(),
        }).options({abortEarly: false});
        const options = {
            abortEarly: false,
            allowUnknown: false,
            stripUnknown: true
        };
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
    },

    verifyForgotPasswordTokenSchema: (req, res, next) => {
        const schema = Joi.object({
            email: Joi.required(),
            token: Joi.required()
        }).options({abortEarly: false});
        const options = {
            abortEarly: false,
            allowUnknown: false,
            stripUnknown: true
        };
        const {error, value} = schema.validate(req.params);
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
    },
 
    resetPasswordSchema: (req, res, next) => {
        const schema = Joi.object({
            email: Joi.string().email({
                minDomainSegments: 2,
                tlds: {
                    allow: ['com', 'net']
                }
            }).required(),
            token: Joi.required(),
            password: Joi.string().min(8).required(),
            password_confirmation: Joi.string().valid(Joi.ref('password')).required().error(errors => {
                errors.forEach(err => {
                    if(err.code === 'any.only'){
                        err.message = 'Password and Confirm Password do not match'
                    }
                });
                return errors;
            })
        }).options({abortEarly: false});
        const options = {
            abortEarly: false,
            allowUnknown: false,
            stripUnknown: true
        };
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
    },
}