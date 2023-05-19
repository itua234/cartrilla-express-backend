const express = require('express');
const router = express.Router();
const auth = require('../controllers/auth');
const { isAuthenticated } = require("../middleware/auth") ;
const { 
    registerSchema, 
    loginSchema, 
    verifyEmailSchema, 
    forgotPasswordSchema,
    verifyForgotPasswordTokenSchema,
    resetPasswordSchema
} = require('../schemas/auth');

var multer = require('multer');
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/uploads')
    },
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, Date.now() + '-' + file.originalname)
    }
});
var upload = multer({storage: storage});

router.post('/register/', registerSchema, auth.register);
router.post('/login', loginSchema, auth.login);
router.get('/logout', isAuthenticated, auth.logout);
//router.post('resend-code/:code/', auth.resendCode);
router.post('/email/verify/:email/:code/', verifyEmailSchema, auth.verifyEmail);
router.get('/verify/reset/token/:email/:token', verifyForgotPasswordTokenSchema, auth.verifyForgotPasswordToken);
router.post('/password/forgot', forgotPasswordSchema, auth.forgotPassword);
router.post('/password/reset', resetPasswordSchema, auth.resetPassword);
//router.post('/change-password', isAuthenticated, auth.changePassword);
router.get('/sendmail', auth.sendmail);

router.post('/upload-file', upload.single('image'), (req, res, next) => {
    res.json(req.file.filename);
})

module.exports = router;