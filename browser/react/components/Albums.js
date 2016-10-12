'use strict';

import React, { Component } from 'react';

const convertAlbumToImage = album => {
  album.imageUrl = `/api/albums/${album.id}/image`;
  return album.imageUrl;
};


export default class Albums extends Component {
  constructor(props){
    super(props)
  }

  componentDidMount () {
    fetch('/api/albums/')
      .then(res => res.json())
      .then(album => this.props.loadAlbums(album));
  }

  render(){

    return (

      <div>
      <h3>Albums</h3>
        {
          this.props.albums.map((album) => {
              return (
                <div>
                  <div className="row col-xs-3">
                    <div style={{display: 'inline-block'}} >
                        <img style={{width: '100%'}}src={convertAlbumToImage(album)} />
                        <div className="caption">
                          <h5>
                            <span> {album.name}</span>
                          </h5>
                          <small> {album.songs.length}  Songs</small>
                        </div>
                    </div>
                  </div>
                </div>

              )

          })
        }
      </div>
    )

  }
}
