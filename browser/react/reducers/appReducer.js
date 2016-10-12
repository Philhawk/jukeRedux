import React from 'react';
import initialState from '../initialState';
import { RECEIVE_ALBUMS_FROM_SERVER } from '../actionTypes'
import { createStore } from 'redux';


function reducer (state = initialState, action) {
  switch (action.type) {
    case RECEIVE_ALBUMS_FROM_SERVER: return Object.assign({}, state, {albums: action.albums});
    default: return state;
  }
}

const store = createStore(reducer);

export default store;
