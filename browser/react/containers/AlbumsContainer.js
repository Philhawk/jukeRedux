import React from 'react';
import Albums from '../components/Albums';
import store from '../reducers/appReducer';
import { connect } from 'react-redux';
import { RECEIVE_ALBUMS_FROM_SERVER } from '../actionTypes'

const mapStateToProps = function ({ albums }, ownProps) {
  return { albums };
}

const receiveAlbums = function (albums) {
  return { type: RECEIVE_ALBUMS_FROM_SERVER, albums }
};

const mapDispatchToProps = function (dispatch, ownProps) {
  return {
    loadAlbums (albums) {
      dispatch( receiveAlbums );
    }
  }
}

const AlbumsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Albums);

export default AlbumsContainer;
