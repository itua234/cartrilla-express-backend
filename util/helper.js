const crypto = require('crypto');
const algorithm = 'aes-256-cbc'  //Using AES encryption
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

module.exports = {
    generateReference: (id) => 
    {
        let token = "";
        let codeAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        codeAlphabet += 'abcdefghijklmnopqrstuvwxyz';
        codeAlphabet += '0123456789';
        let max = codeAlphabet.length - 1;
        for(var i = 0; i < 14; i++){
            token += codeAlphabet[Math.floor(Math.random() * (max - 0) + 0)]; 
        }; 
        return id+token.toLowerCase();
    },
    //Encrypting text
    encrypt: (text) =>
    {
        let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        // return {iv: iv.toString('hex'), encryptedData: encrypted.toString('hex')};
        return iv.toString('hex') + ":" + encrypted.toString('hex');
    },
    //Decrypting text
    decrypt: (text) =>
    {
        const textParts = text.split(":");
        let iv = Buffer.from(textParts[0], 'hex');
        let encryptedText = Buffer.from(textParts[1], 'hex');
        let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    },
    generateOtp: () => 
    {
        // Generates Random number between given pair
        return Math.floor(Math.random() * (9999 - 1000) + 1000);
    },
    slugify: (string) =>
    {
        const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let randomString = "";
        for (let i=0; i<5; i++){
            randomString += characters.charAt(Math.floor(Math.random() * characters.length))
        }
        return string.replaceAll(' ', '-') + '-' + randomString;
    },
    modifyTime: (dateStr) => {
        const date = new Date(dateStr);
        const months = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
        ]
        const monthName = months[date.getMonth()];
        const year = date.getFullYear();
        return `${monthName}, ${year}`;
    },
    returnValidationError: (errors, res, message) => {

        Object.keys(errors).forEach((key, index) => {
            errors[key] = errors[key]["message"];
        });

        return res.status(422).json({
            status: "fail",
            message: message,
            error: errors
        });

    }

}