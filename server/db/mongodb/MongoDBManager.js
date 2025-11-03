const DatabaseManager = require('../DatabaseManager');
const mongoose = require('mongoose');
const User = require('../../models/user-model');
const Playlist = require('../../models/playlist-model');


class MongoDBManager extends DatabaseManager{

    async initialize(){
        await mongoose.connect(process.env.DB_CONNECT, {useNewParser: true});
        console.log('Connected to MongoDB');
    }


    async getUserById(UserId){
        return await User.findOne({ _id: userId });
    }
    
    async getUserByEmail(email) {
        return await User.findOne({ email: email });
    }
    
    async createUser(userData) {
        const newUser = new User(userData);
        return await newUser.save();
    }
    
}