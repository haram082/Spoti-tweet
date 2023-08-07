import React from 'react'
import Song from './Song'

const Songs = (props: {playlist: SpotifyApi.SinglePlaylistResponse | SpotifyApi.SingleAlbumResponse| null, album: boolean, albumName: string | null, albumImage: string |null }) => {
  return (
    <div className='px-8 flex flex-col space-y-1 pb-20 mt-5'>
      {props.playlist?.tracks?.items?.map((track: any, i:number) => (
        <Song key={props.album ? track.id : track.track?.id} track={track} order={i} 
        album={props.album} albumImage={props.albumImage} albumName={props.albumName}/>

      ))}
    </div>
  )
}

export default Songs
