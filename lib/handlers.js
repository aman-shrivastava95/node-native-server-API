/*
* These are the request handlers
*/
//defining handlers

//dependencies
var _data = require('./data') ;
var helpers = require('./helpers') ;

var handlers = {} ;

//users
handlers.users = function(data, callback){
    var acceptableMethods = ['post','get','put','delete'] ;
    if(acceptableMethods.indexOf(data.method) > -1){
        handlers._users[data.method](data,callback) ;
    }else{
        callback(405) ;
    }
}
//container for the user submethod
handlers._users = {} ;
//Users - post
//Required data: firstName,lastName, phone, password, tosAgreement
//optional data: None
handlers._users.post = function(data,callback){
    var firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ?data.payload.firstName.trim():false ;
    var lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ?data.payload.lastName.trim():false ;
    var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ?data.payload.phone.trim():false ;
    var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ?data.payload.password.trim():false ;
    var tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ? true: false ;

    if(firstName && lastName && phone && password && tosAgreement){
        //make sure the user doesn't exists
        _data.read('users',phone,function(err,data){
            if(err){
                //hash the password
                var hashedPassword = helpers.hash(password) ;
                if(hashedPassword){
                    var userObject = {
                        'firstName':firstName,
                        'lastName':lastName,
                        'phone':phone,
                        'hashedPassword':hashedPassword,
                        'tosAgreement':true
                    }
                    _data.create('users',phone,userObject,function(err){
                        if(!err){
                            callback(200) ;
                        }else{
                            console.log(err) ;
                            callback(500,{'Error':'Could not create the new user'}) ;
                        }
                    })
                }else{
                    callback(500,{'Error':'Could not hash the user password'}) ;
                }

            }else{
                callback(400,{'Error':'A user with that phone number already exists'}) ;
            }
        }) ;
    }else{
        callback(400,{'Error':'Missing required fields'}) ;
    }

} ;
//Users - get
//Required data: phone
//optional data: None
//@TODO Only let the authenticated user access their object
handlers._users.get = function(data,callback){
    var phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 10 ?data.queryStringObject.phone:false ;
    if(phone){
        _data.read('users',phone,function(err,data){
            if(!err && data){
                delete data.hashedPassword ;
                callback(200,data) ;
            }else{
                callback(404) ;
            }
        })
    }else{
        callback(400,{'Error':'Missing required fields'}) ;
    }
} ;
//Users - put
//Required data: phone
//optional data: everything else firstName, lastName, password , atelast one must be specified
//@TODO : only let authenticated user update their own object
handlers._users.put = function(data,callback){
    //req field
    var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ?data.payload.phone.trim():false ;
    //optional fields
    var firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ?data.payload.firstName.trim():false ;
    var lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ?data.payload.lastName.trim():false ;
    var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ?data.payload.password.trim():false ;
    
    if(phone){
        if(firstName || lastName || phone){
            _data.read('users',phone,function(err,userData){
                if(!err && userData){
                    if(firstName){
                        userData.firstName = firstName ;
                    }
                    if(lastName){
                        userData.lastName = lastName ;
                    }
                    if(password){
                        userData.hashedPassword = helpers.hash(password) ;
                    }
                    //store the new updates
                    _data.update('users',phone,userData,function(err){
                        if(!err){
                            callback(200) ;
                        }else{
                            callback(500,{'Error':'Could not update the user'}) ;
                        }
                    })
                }else{
                    callback(400,{'Error':'The specified user does not exists'})
                }
            }) 
        }else{
            callback(400,{'Error':'Missing fields to update'}) ;
        }
    }else{
        callback(400,{'Error':'Missing required field'})
    }
    
} ;
//Users - delete
//Required fields : phone
//optional fields : None
//@TODO : only let authenticated user update their record
handlers._users.delete = function(data,callback){
    var phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 10 ?data.queryStringObject.phone:false ;
    if(phone){
        _data.read('users',phone,function(err,data){
            if(!err && data){
                _data.delete('users',phone,function(err){
                    if(!err){
                        callback(200) ;
                    }else{
                        callback(500,'Could not delete the specified user')
                    }
                }) ;
            }else{
                callback(400,{'Error':'Could not find the specified user'}) ;
            }
        })
    }else{
        callback(400,{'Error':'Missing required fields'}) ;
    }
} ;


handlers.ping = function(data, callback){
    callback(200) ;
}
handlers.notFound = function(data, callback){
    callback(404) ;
} ;

module.exports = handlers ;