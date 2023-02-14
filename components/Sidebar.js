import { HomeIcon, SearchIcon, LibraryIcon, PlusCircleIcon, HeartIcon, RssIcon } from '@heroicons/react/outline';
import { signOut, useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { useRecoilState } from "recoil";
import useSpotify from "../hooks/useSpotify";
import { playlistIdState } from '../atoms/playlistAtom';

const Sidebar = () => {
    const spotifyApi = useSpotify();
    const { data: session, status } = useSession();
    const [playlists, setPlaylist] = useState([]);
    const [playlistId, setPlaylistId] = useRecoilState(playlistIdState);
    console.log(playlistId);

    useEffect(() => {
        if (spotifyApi.getAccessToken()) {
            spotifyApi.getUserPlaylists().then((data) => {
                setPlaylist(data.body.items);
            });
        }
    }, [session, spotifyApi]);

    return (
        <div className='text-gray-500 p-5 text-sm lg:text-sm border-r border-gray-900 overflow-y-scroll h-screen scrollbar-hide sm:max-w-[12rem] lg:max-w-[15rem] hidden md:inline-flex'>
            <div className='space-y-4'>
                <button className='flex items-center space-x-3
                text-white hover:text-white 
                bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 ... 
                px-9 py-3 rounded-full' onClick={signOut}>
                    <p>LogOut</p>
                </button>
                <button className='flex items-center space-x-3 hover:text-white'>
                    <HomeIcon className="h-5 w-5" />
                    <p>Home</p>
                </button>
                <button className='flex items-center space-x-3 hover:text-white'>
                    <SearchIcon className="h-5 w-5" />
                    <p>Search</p>
                </button>
                <button className='flex items-center space-x-3 hover:text-white'>
                    <LibraryIcon className="h-5 w-5" />
                    <p>Your Library</p>
                </button>
                <hr className='border-t-[0.1px] border-gray-900' />
                {/*  */}
                <button className='flex items-center space-x-3 hover:text-white'>
                    <PlusCircleIcon className="h-5 w-5" />
                    <p>Create Playlist</p>
                </button>
                <button className='flex items-center space-x-3 hover:text-white'>
                    <HeartIcon className="h-5 w-5" />
                    <p>Your Library</p>
                </button>
                <button className='flex items-center space-x-3 hover:text-white'>
                    <RssIcon className="h-5 w-5" />
                    <p>Your Episodes</p>
                </button>
                <hr className='border-t-[0.1px] border-gray-900' />

                {/* Will create the playlist here */}
                {playlists && playlists.map((playlist) => (
                    <p key={playlist.id} onClick={() => {setPlaylistId(playlist.id)}} className='cursor-pointer hover:text-white'>{playlist.name}</p>
                ))}
            </div>
        </div>
    )
}

export default Sidebar;
