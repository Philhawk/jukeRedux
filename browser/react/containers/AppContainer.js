'use strict';

import React, { Component } from 'react';

import initialState from '../initialState';
import AUDIO from '../audio';

import Sidebar from '../components/Sidebar';
import Album from '../components/Album';
import AlbumsContainer from './AlbumsContainer';
import Player from '../components/Player';

const convertSong = song => {
  song.audioUrl = `/api/songs/${song.id}/audio`;
  return song;
};

const convertAlbum = album => {
  album.imageUrl = `/api/albums/${album.id}/image`;
  album.songs = album.songs.map(convertSong);
  return album;
};

const mod = (num, m) =>((num % m) + m) % m;

const skip = (interval, { currentSongList, currentSong }) => {
  let idx = currentSongList.map(song => song.id).indexOf(currentSong.id);
  idx = mod(idx + interval, currentSongList.length);
  const next = currentSongList[idx];
  return [next, currentSongList];
};

export default class AppContainer extends Component {

  constructor (props) {
    super(props);
    this.state = initialState;

    this.toggle = this.toggle.bind(this);
    this.toggleOne = this.toggleOne.bind(this);
    this.next = this.next.bind(this);
    this.prev = this.prev.bind(this);
  }

  componentDidMount () {
    fetch('/api/albums/2')
      .then(res => res.json())
      .then(album => this.onLoad(convertAlbum(album)));

    AUDIO.addEventListener('ended', () =>
      this.next());
    AUDIO.addEventListener('timeupdate', () =>
      this.setProgress(AUDIO.currentTime / AUDIO.duration));
  }

  onLoad (album) {
    this.setState({ album });
  }

  play () {
    AUDIO.play();
    this.setState({ isPlaying: true });
  }

  pause () {
    AUDIO.pause();
    this.setState({ isPlaying: false });
  }

  load (currentSong, currentSongList) {
    AUDIO.src = currentSong.audioUrl;
    AUDIO.load();
    this.setState({ currentSong, currentSongList });
  }

  startSong (song, list) {
    this.pause();
    this.load(song, list);
    this.play();
  }

  toggleOne (selectedSong, selectedSongList) {
    if (selectedSong.id !== this.state.currentSong.id)
      this.startSong(selectedSong, selectedSongList);
    else this.toggle();
  }

  toggle () {
    if (this.state.isPlaying) this.pause();
    else this.play();
  }

  next () {
    this.startSong(...skip(1, this.state));
  }

  prev () {
    this.startSong(...skip(-1, this.state));
  }

  seek (decimal) {
    AUDIO.currentTime = AUDIO.duration * decimal;
    this.setProgress(AUDIO.currentTime / AUDIO.duration);
  }

  setProgress (progress) {
    this.setState({ progress });
  }

  render () {
    return (
      <div id="main" className="container-fluid">
        <div className="col-xs-2">
          <Sidebar />
        </div>
        <div className="col-xs-10">
         <AlbumsContainer />
          <Album
            album={this.state.album}
            currentSong={this.state.currentSong}
            isPlaying={this.state.isPlaying}
            toggle={this.toggleOne}
          />
        </div>
        <Player
          currentSong={this.state.currentSong}
          currentSongList={this.state.currentSongList}
          isPlaying={this.state.isPlaying}
          progress={this.state.progress}
          next={this.next}
          prev={this.prev}
          toggle={this.toggle}
          scrub={evt => this.seek(evt.nativeEvent.offsetX / evt.target.clientWidth)}
        />
      </div>
    );
  }
}
