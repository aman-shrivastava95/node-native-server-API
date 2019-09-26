/* 
* Helpers for various task 
*/

//dependencies
var crypto = require('crypto') ;
var config = require('./config') ;

var helpers = {} ;

//create a SHA-256 hash
helpers.hash = function(str){
    if(typeof(str) == 'string' && str.length > 0){
        var hash = crypto.createHmac('sha256',config.hashingSecret).update(str).digest('hex') ;
        return hash ;
    }else{
        return false ;
    }
}
//parse a JSON string to an object in all cases without throwing
helpers.parseJsonToObject = function(str){
    try{
        var obj = JSON.parse(str) ;
        return obj ;
    }catch(e){
        return {} ; 
    }
}

//create a create of random alphanumeric charecters of the given length
helpers.createRandomString = function(strLength){
    strLength = typeof(strLength)=='number' && strLength >0 ?strLength:false ;
    if(strLength){
        var possibleCharecters = 'abcdefghijklmnopqrstuvwxyz1234567890' ;
        var str ='' ;
        for(var i = 1;i<=strLength;i++){
            var randomCharecter = possibleCharecters.charAt(Math.floor(Math.random()*possibleCharecters.length)) ;
            str+=randomCharecter ;
        }
        return str ;
    }else{
        return false ;
    }
}




module.exports = helpers ;