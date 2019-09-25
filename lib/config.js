/* create and export all the environment configurations*/

//container for all the environments
 var environments = {};
 //Staging default
 environments.staging = {
     'httpPort':3000,
     'httpsPort':3001,
     'envName':'staging',
     'hashingSecret':'thisIsASecret'
 } ;
 //production
 environments.production = {
     'httpPort':5000,
     'httpsPort':5001,
     'envName':'production',
     'hashingSecret':'thisIsAlsoASecret'
 } ;

 //determine which argument was passed as a command line argument 
 var currentEnvironment = typeof(process.env.NODE_ENV)=='string'?process.env.NODE_ENV.toLowerCase():'' ;
 var environmentToExport = typeof(environments[currentEnvironment]) == 'object'?environments[currentEnvironment]:environments.staging ;

 module.exports = environmentToExport ;
