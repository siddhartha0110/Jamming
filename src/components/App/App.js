/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import './App.css';

import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlistName: "My Playlist",
      playlistTracks: []
    }
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  //Add Tracks To Playlist
  addTrack(track) {
    let tracks = this.state.playlistTracks;
    if (tracks.find(savedTrack => savedTrack.id === track.id)) {
      return
    }
    tracks.push(track);
    this.setState({ playlistTracks: tracks });
  }

  //Remove a Track from the Playlist
  removeTrack(track) {
    let tracks = this.state.playlistTracks;
    tracks = tracks.filter(currentTrack => currentTrack.id !== track.id)
    this.setState({ playlistTracks: tracks })
  }

  //Update Playlist Name
  updatePlaylistName(name) {
    this.setState({ playlistName: name })
  }

  //Save Playlist
  savePlaylist() {
    const trackUris = this.state.playlistTracks.map(tracks => tracks.uri)
    Spotify.savePlaylist(this.state.playlistName, trackUris)
      .then(() => {
        console.log("Playlist Saved");
        this.setState({ playlistName: 'New Playlist', playlistTracks: [] })
      })
  }

  //Search Spotify
  search(searchTerm) {
    Spotify.search(searchTerm).then(searchResults => {
      this.setState({ searchResults: searchResults })
    })
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">

            <SearchResults searchResults={this.state.searchResults}
              onAdd={this.addTrack} />

            <Playlist playlistName={this.state.playlistName}
              playlistTracks={this.state.playlistTracks}
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist} />

          </div>
        </div>
      </div>
    );
  }
}

export default App;
