const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createAccessToken } = require("../middleware/auth") ;
const { sequelize, models: { User, Otp } } = require('../models');
const { generateOtp } = require('../util/helper');
require('dotenv').config();

exports.register = async(req, res) => {
    const { firstname, lastname, email, phone, password } = req.body;
    
    try{
        await sequelize.transaction(async function(transaction) {
            const user = await User.create({
                firstname, lastname, email, phone, password
            }, {transaction});
        
            await Otp.create({ 
                otpable_id: user.id,
                otpable_type: "user",
                token: generateOtp(),
                purpose: "email_verification"
            }, {transaction});

            //create token
            const token = createAccessToken(user);
            return res.status(201).json({
                message: 'Thanks for signing up! Please check your email to complete your registration.',
                results: token,
                error: false
            });
        });
    }catch(error){
        return res.status(500).json({
            message: "could not create account, please try again later",
            error: true
        });
    }

};

exports.login = async(req, res) => {
    const { email, password } = req.body;
    let user = await User.findOne({
        where: {
            email: email,
        },
        raw: true
    });
    if(!user || !(await bcrypt.compare(password, user.password))){
        return res.status(400).json({
            message: "Wrong credentials",
            error: true
        });
    }else if(!user.email_verified_at){
        return res.status(401).json({
            message: "Email address not verified, please verify your email before you can login",
            error: true
        });
    }else{
        //create token
        const token = createAccessToken(user);
        res.status(200).json({
            message: 'Login successful',
            results: token,
            error: false
        });
    }
};

exports.logout = (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const user = jwt.decode(
        token, 
        process.env.TOKEN_SECRET
    );

    var newToken = jwt.sign(
        {user: user},
        process.env.TOKEN_SECRET,
        {
            expiresIn: '1s',
        }
    );
   
    return res.status(200).json({
        message: 'You have been logged out',
        results: newToken,
        error: false
    });
}

exports.verifyEmail = async(req, res) => {
    const { email, token } = req.params;
    const user = await User.findOne({
        where: {
            email: email
        },
        raw:true
    });
    let check = await Otp.findOne({
        where: {
            otpable_id: user.id,
            otpable_type: "user",
            token: token,
            purpose: 'email_verification',
            valid: true
        },
        raw: true
    });

    if(Object.is(check, null)){
        res.send({msg: 'null'});
    }else{
        user.email_verified_at = new Date();
        await user.save();

        //await check.destroy();

        message = 'Your email address is verified successfully.';
        //return view('auth.email-verification-success', ['user' => $user ]);
        res.send(user);
    }
};

exports.forgotPassword = async(req, res) => {
    const { email } = req.body;
    let user = await User.findOne({
        where: {
            email: email,
        },
        raw:true
    });
    
    await Otp.create({ 
        otpable_id: user.id,
        otpable_type: "user",
        token: generateOtp(),
        purpose: "password_reset"
    }, {transaction});

    message = 'A password reset email has been sent! Please check your email.';  
    return res.status(200).json({
        message: message,
        results: null,
        error: false
    });
};

exports.verifyForgotPasswordToken = async(req, res) => {
    const { email, token } = req.params;
    let user = await User.findOne({
        where: {
            email: email,
        },
        raw:true
    });

    let check = await Otp.findOne({
        where: {
            otpable_id: user.id,
            otpable_type: "user",
            token: token,
            purpose: 'password_reset',
            valid: true
        },
        raw: true
    });

    if(Object.is(check, null)){
        return res.status(400).json({
            message: 'Invalid data.',
            results: null,
            error: false
        });
    }else{
        return res.status(200).json({
            message: 'Your token verification was successful.',
            results: check,
            error: false
        });
    }
};

exports.resetPassword = async(req, res) => {
    const { email, token, password } = req.body;
    let user = await User.findOne({
        where: {email: email}
    });
    user.password = password;
    await user.save();

    await Otp.destroy({
        where: {
            otpable_id: user.id,
            otpable_type: "user",
            purpose: "password_reset",
            token: token,
            valid: true
        },
        raw: true
    });

    return res.status(200).json({
        message: 'Your password has been successfully changed',
        results: null,
        error: false
    });
};

exports.sendmail = (req, res) => {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD
        }
    });

    var mailOptions = {
        from: 'sivatech234@gmail.com',
        to: 'ituaosemeilu234@gmail.com',
        subject:'Sending Email using Node.js',
        text: 'That was easy'
    };
    
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            res.json('error');
        }else{
            res.json('Email sent: '+ info.response);
        }
    });
};