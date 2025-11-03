class DatabaseManager {

    async initialize() {
        throw new Error('initialize() must be implemented by subclass');
    }
    async getUserById(userId) {
        throw new Error('getUserById() must be implemented by subclass');
    }
    async getUserByEmail(email) {
        throw new Error('getUserByEmail() must be implemented by subclass');
    }
    async createUser(userData) {
        throw new Error('createUser() must be implemented by subclass');
    }
    async addPlaylistToUser(userId, playlistId) {
        throw new Error('addPlaylistToUser() must be implemented by subclass');
    }
    async createPlaylist(playlistData) {
        throw new Error('createPlaylist() must be implemented by subclass');
    }
    async getPlaylistById(playlistId) {
        throw new Error('getPlaylistById() must be implemented by subclass');
    }
    async getPlaylistsByOwnerEmail(email) {
        throw new Error('getPlaylistsByOwnerEmail() must be implemented by subclass');
    }
    async getAllPlaylists() {
        throw new Error('getAllPlaylists() must be implemented by subclass');
    }
    async updatePlaylist(playlistId, updateData) {
        throw new Error('updatePlaylist() must be implemented by subclass');
    }
    async deletePlaylist(playlistId) {
        throw new Error('deletePlaylist() must be implemented by subclass');
    }
}

module.exports = DatabaseManager;