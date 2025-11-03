const dotenv = require('dotenv').config({ path: __dirname + '/../../../.env' });

const { Sequelize, DataTypes } = require('sequelize');


// Now we have to make the connection to the server

const sequelize = new Sequelize(
    process.env.POSTGRES_DB,      
    process.env.POSTGRES_USER,    
    process.env.POSTGRES_PASSWORD, 
    {
        host: process.env.POSTGRES_HOST,
        port: process.env.POSTGRES_PORT,
        dialect: 'postgres',
        logging: false 
    }
);

const User = sequelize.define('User', {
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true 
    },
    passwordHash: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'Users',
    timestamps: true  
});

const Playlist = sequelize.define('Playlist', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ownerEmail: {
        type: DataTypes.STRING, 
        allowNull: false
    },
    songs: {
        type: DataTypes.JSONB, 
        allowNull: false,
        defaultValue: []
    }
}, {
    tableName: 'Playlists',
    timestamps: true
});