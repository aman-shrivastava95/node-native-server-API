/*
*library for storing and editing data
*/
var fs = require('fs') ;
var path = require('path') ;
var helpers = require('./helpers')

var lib={} ;
//base directory of the data folder
lib.baseDir = path.join(__dirname,'/../.data/') ;

//Write data to a file
lib.create = function(dir,file,data,callback){
    fs.open(lib.baseDir+dir+'/'+file+'.json','wx',function(err,fileDescriptor){
        if(!err && fileDescriptor){
            var StringData = JSON.stringify(data) ;
            //write to the file and close it
            fs.writeFile(fileDescriptor,StringData,function(err){
                if(!err){
                    fs.close(fileDescriptor,function(err){
                        if(!err){
                            callback(false) ;
                        }else{
                            callback('error closing new file.');
                        }
                    }) ;
                }else{
                    callback('error writing to a new file.')
                }
            }) ;
        }else{
            callback('Could not create a new file, It may already exist.')
        }
    }) ;
};
//Read data from a file
lib.read = function(dir,file,callback){
    fs.readFile(lib.baseDir+dir+'/'+file+'.json','utf8',function(err,data){
        if(!err){
            var parsedData = helpers.parseJsonToObject(data) ;
            callback(false,parsedData) ;
        }else{
            callback(err,data) ;
        }
    }) ;
};
//update data inside the file
lib.update = function(dir,file,data,callback){
    fs.open(lib.baseDir+dir+'/'+file+'.json','r+',function(err,fileDescriptor){
        if(!err && fileDescriptor){
            var StringData = JSON.stringify(data) ;
            fs.truncate(fileDescriptor,function(err){
                if(!err){
                    fs.writeFile(fileDescriptor,StringData,function(err){
                        if(!err){
                            fs.close(fileDescriptor,function(err){
                                if(!err){
                                    callback(false) ;
                                }else{
                                    callback('error closing existing file.')
                                }
                            })
                        }else{
                            callback('error writing to the existing file')
                        }
                    })
                }else{
                    callback('error truncating file.') ;
                }
            })

        }else{
            callback('Could not open file for updating. It may not exist yet.')
        }
    }) ;
}
//deleting the file
lib.delete = function(dir,file,callback){
    fs.unlink(lib.baseDir+dir+'/'+file+'.json',function(err){
        if(!err){
            callback(false) ;
        }else{
            callback('error deleting file') ;
        }
    })
}



module.exports = lib ;