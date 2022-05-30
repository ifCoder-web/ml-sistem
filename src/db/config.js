if(process.env.NODE_ENV == "production"){
    module.exports = {mongoURI: process.env.NODE_ENV}
}else{
    module.exports = {mongoURI: "mongodb://localhost:27017/mlsistem"}
}