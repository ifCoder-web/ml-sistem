if(process.env.NODE_ENV == "production"){
    module.exports = {mongoURI: process.env.MONGO_URI}
}else{
    module.exports = {mongoURI: "mongodb://localhost:27017/mlsistem"}
}