import React from 'react';
import {connect} from 'react-redux';
import YouTube from 'react-youtube';
import {deleteSongFromQueue} from '../store'

class VideoPlayer extends React.Component {
constructor(){
  super()
  this.videoStateChange = this.videoStateChange.bind(this)
}
  videoOnReady(event) {
    // access to player in all event handlers via event.target
   
   event.target.playVideo();
  }

  videoStateChange(event){
    if(event.data===0){
      this.props.deleteSongFromQueue(this.props.queue[0],this.props.auth.roomId,this.props.queue[3])
    }
  }
  render() {
   const windowWidth = window.innerWidth
    const opts = windowWidth>700?{
      height: '390',
      width: '640',
      playerVars: {
        autoplay: 1,
      },
    }:{
      height: '230',
      width: windowWidth-10,
      playerVars: {
        autoplay: 1,
      },
    };
   // console.log(this.props)
    const {videoId} = this.props
  // console.log('VIDEOID: ',videoId)
    return <YouTube 
    videoId={videoId}
    opts={opts} 
    onReady={this.videoOnReady}
    onStateChange={this.videoStateChange} />;
  }
}

const mapState = state => state

const mapDispatch = (dispatch) => {
  return {
    deleteSongFromQueue: (song,room,nextSong) => dispatch(deleteSongFromQueue(song,room,nextSong)),
  }
};

export default connect(mapState,mapDispatch)(VideoPlayer)