const clientID = 'd6f41ad80e564b12b46cc0651a31514b';
const redirectURI = 'http://JammingSpotify.surge.sh';

let accessToken;


const Spotify = {
    getAccessToken() {
        if (accessToken) {
            return accessToken
        }
        //Check if accessToken absent
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/)
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/)
        if (accessTokenMatch && expiresInMatch) {
            accessToken = accessTokenMatch[1];
            const expires_in = Number(expiresInMatch[1]);
            //Clear the parameters and helps us to grab new access token when it expires
            window.setTimeout(() => accessToken = '', expires_in * 1000);
            window.history.pushState('Access Token', null, '/');
            return accessToken;
        }
        else {
            const accessURL = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`
            window.location = accessURL;
        }

    },

    async search(term) {
        const accessToken = Spotify.getAccessToken();
        const response = await fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        const jsonResponse = await response.json();
        if (!jsonResponse.tracks) {
            return [];
        }
        return jsonResponse.tracks.items.map(track => ({
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri
        }));
    },

    async savePlaylist(name, tracksURIs) {

        if (!name || !tracksURIs) {
            return;
        }
        const accessToken = Spotify.getAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}` }
        let userID;

        const response = await fetch('https://api.spotify.com/v1/me', { headers: headers });
        const jsonResponse = await response.json();
        userID = jsonResponse.id;
        const response_1 = await fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
            headers: headers,
            method: "POST",
            body: JSON.stringify({ name: name })
        });
        const jsonResponse_1 = await response_1.json();
        const playlistId = jsonResponse_1.id;
        return fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistId}/tracks`, {
            headers: headers,
            method: "POST",
            body: JSON.stringify({ uris: tracksURIs })
        },
            console.log("SAVING"));

    }
}

export default Spotify;