// const DatabaseManager = require('../DatabaseManager');
// const mongoose = require('mongoose');
// const User = require('../../models/user-model');
// const Playlist = require('../../models/playlist-model');

const auth = require('../auth');
const dbManager = require('../db');
/*
    This is our back-end API. It provides all the data services
    our database needs. Note that this file contains the controller
    functions for each endpoint.
    
    @author McKilla Gorilla
*/
createPlaylist = async (req, res) => {
    try{
    if(auth.verifyUser(req) === null){
        return res.status(400).json({
            errorMessage: 'UNAUTHORIZED'
        })
    }
    const body = req.body;
    console.log("createPlaylist body: " + JSON.stringify(body));
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a Playlist',
        })
    }
    
    const playlist = await dbManager.createPlaylist(body);
    console.log("playlist created: " + JSON.stringify(playlist));
    // if (!playlist) {
    //     return res.status(400).json({ success: false, error: err })
    // }

    // User.findOne({ _id: req.userId }, (err, user) => {
    //     console.log("user found: " + JSON.stringify(user));
    //     user.playlists.push(playlist._id);
    //     user
    //         .save()
    //         .then(() => {
    //             playlist
    //                 .save()
    //                 .then(() => {
    //                     return res.status(201).json({
    //                         playlist: playlist
    //                     })
    //                 })
    //                 .catch(error => {
    //                     return res.status(400).json({
    //                         errorMessage: 'Playlist Not Created!'
    //                     })
    //                 })
    //         });
    // })
    await dbManager.addPlaylistToUser(req.userId, playlist.id || playlist._id);
        
        return res.status(201).json({
            playlist: playlist
        })
    }
    catch (error) {
        console.error(error);
        return res.status(400).json({
            errorMessage: 'Playlist Not Created!'
        })

    }
    
}
deletePlaylist = async (req, res) => {
    if(auth.verifyUser(req) === null){
        return res.status(400).json({
            errorMessage: 'UNAUTHORIZED'
        })
    }
    try{
    const playlist = await dbManager.getPlaylistById(req.params.id);
    console.log("playlist is found: "+ JSON.stringify(playlist));

    if(!playlist){
        return res.status(404).json({
            errorMessage: "Playlist not found",
        })
    }
    const user = await dbManager.getUserByEmail(playlist.ownerEmail);
    console.log("user.id: " + (user.id || user._id));
    console.log("req.userId: " + req.userId);

    if ((user.id || user._id) == req.userId) {
        console.log("correct user!");
        await dbManager.deletePlaylist(req.params.id);
        return res.status(200).json({});
    } else {
        console.log("incorrect user!");
        return res.status(400).json({ 
            errorMessage: "authentication error" 
        });

    } 
    }  catch (err) 
    { console.error(err); return res.status(400).json({ errorMessage: 'Error deleting playlist' })
}
}
getPlaylistById = async (req, res) => {
    if(auth.verifyUser(req) === null){
        return res.status(400).json({
            errorMessage: 'UNAUTHORIZED'
        })
    }

    try{
        const list = await dbManager.getPlaylistById(req.params.id);
        if (!list) {
        return res.status(400).json({ success: false, error: 'Playlist not found' });
    }
    console.log("Found list: " + JSON.stringify(list));
    
    const user = await dbManager.getUserByEmail(list.ownerEmail);
    console.log("user.id: " + (user.id || user._id));
    console.log("req.userId: " + req.userId);
    
    if ((user.id || user._id) == req.userId) {
        console.log("correct user!");
        return res.status(200).json({ success: true, playlist: list })
    } else {
        console.log("incorrect user!");
        return res.status(400).json({ success: false, description: "authentication error" });
    }

    }
    catch (err) { console.error(err); 
        return res.status(400).json({ success: false, error: err }); }
    // console.log("Find Playlist with id: " + JSON.stringify(req.params.id));

    // await Playlist.findById({ _id: req.params.id }, (err, list) => {
    //     if (err) {
    //         return res.status(400).json({ success: false, error: err });
    //     }
    //     console.log("Found list: " + JSON.stringify(list));

    //     // DOES THIS LIST BELONG TO THIS USER?
    //     async function asyncFindUser(list) {
    //         await User.findOne({ email: list.ownerEmail }, (err, user) => {
    //             console.log("user._id: " + user._id);
    //             console.log("req.userId: " + req.userId);
    //             if (user._id == req.userId) {
    //                 console.log("correct user!");
    //                 return res.status(200).json({ success: true, playlist: list })
    //             }
    //             else {
    //                 console.log("incorrect user!");
    //                 return res.status(400).json({ success: false, description: "authentication error" });
    //             }
    //         });
    //     }
    //     asyncFindUser(list);
    // }).catch(err => console.log(err))
}
getPlaylistPairs = async (req, res) => {
    if(auth.verifyUser(req) === null){
        return res.status(400).json({
            errorMessage: 'UNAUTHORIZED'
        })
    }
    console.log("getPlaylistPairs");
    await User.findOne({ _id: req.userId }, (err, user) => {
        console.log("find user with id " + req.userId);
        async function asyncFindList(email) {
            console.log("find all Playlists owned by " + email);
            await Playlist.find({ ownerEmail: email }, (err, playlists) => {
                console.log("found Playlists: " + JSON.stringify(playlists));
                if (err) {
                    return res.status(400).json({ success: false, error: err })
                }
                if (!playlists) {
                    console.log("!playlists.length");
                    return res
                        .status(404)
                        .json({ success: false, error: 'Playlists not found' })
                }
                else {
                    console.log("Send the Playlist pairs");
                    // PUT ALL THE LISTS INTO ID, NAME PAIRS
                    let pairs = [];
                    for (let key in playlists) {
                        let list = playlists[key];
                        let pair = {
                            _id: list._id,
                            name: list.name
                        };
                        pairs.push(pair);
                    }
                    return res.status(200).json({ success: true, idNamePairs: pairs })
                }
            }).catch(err => console.log(err))
        }
        asyncFindList(user.email);
    }).catch(err => console.log(err))
}
getPlaylists = async (req, res) => {
    if(auth.verifyUser(req) === null){
        return res.status(400).json({
            errorMessage: 'UNAUTHORIZED'
        })
    }
    await Playlist.find({}, (err, playlists) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!playlists.length) {
            return res
                .status(404)
                .json({ success: false, error: `Playlists not found` })
        }
        return res.status(200).json({ success: true, data: playlists })
    }).catch(err => console.log(err))
}
updatePlaylist = async (req, res) => {
    if(auth.verifyUser(req) === null){
        return res.status(400).json({
            errorMessage: 'UNAUTHORIZED'
        })
    }
    const body = req.body
    console.log("updatePlaylist: " + JSON.stringify(body));
    console.log("req.body.name: " + req.body.name);

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    Playlist.findOne({ _id: req.params.id }, (err, playlist) => {
        console.log("playlist found: " + JSON.stringify(playlist));
        if (err) {
            return res.status(404).json({
                err,
                message: 'Playlist not found!',
            })
        }

        // DOES THIS LIST BELONG TO THIS USER?
        async function asyncFindUser(list) {
            await User.findOne({ email: list.ownerEmail }, (err, user) => {
                console.log("user._id: " + user._id);
                console.log("req.userId: " + req.userId);
                if (user._id == req.userId) {
                    console.log("correct user!");
                    console.log("req.body.name: " + req.body.name);

                    list.name = body.playlist.name;
                    list.songs = body.playlist.songs;
                    list
                        .save()
                        .then(() => {
                            console.log("SUCCESS!!!");
                            return res.status(200).json({
                                success: true,
                                id: list._id,
                                message: 'Playlist updated!',
                            })
                        })
                        .catch(error => {
                            console.log("FAILURE: " + JSON.stringify(error));
                            return res.status(404).json({
                                error,
                                message: 'Playlist not updated!',
                            })
                        })
                }
                else {
                    console.log("incorrect user!");
                    return res.status(400).json({ success: false, description: "authentication error" });
                }
            });
        }
        asyncFindUser(playlist);
    })
}
module.exports = {
    createPlaylist,
    deletePlaylist,
    getPlaylistById,
    getPlaylistPairs,
    getPlaylists,
    updatePlaylist
}