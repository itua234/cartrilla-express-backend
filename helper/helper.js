module.exports = {
    generateReference: ($id) => 
    {
        let token = "";
        let codeAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        codeAlphabet += 'abcdefghijklmnopqrstuvwxyz';
        codeAlphabet += '0123456789';
        let length = codeAlphabet.length;
        let max = length - 1;
        for(var i = 0; i < 14; i++){
            token += codeAlphabet[Math.floor(Math.random() * (max - 0) + 0)]; 
        }; 
        return id + token.toLowerCase();
    }
}