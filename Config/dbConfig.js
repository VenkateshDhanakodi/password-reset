const mongodb = require('mongodb');
const dbName = "assign-mentor";
const dbUrl = `mongodb+srv://dnshvenkat:Ipad10.2@simplewebapp.5znthda.mongodb.net/${dbName}`;
const MongoClient = mongodb.MongoClient;
module.exports = {mongodb, dbName, dbUrl, MongoClient};