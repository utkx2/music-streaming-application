import { useSession } from 'next-auth/react';
import { shuffle } from 'lodash';
import { useState, useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { playlistIdState, playlistState } from '../atoms/playlistAtom';
import useSpotify from '../hooks/useSpotify';
import Songs from './Songs';

const colors = [
    "from-indigo-600",
    "from-blue-600",
    "from-green-600",
    "from-red-600",
    "from-yellow-600",
    "from-pink-600",
    "from-purple-600"
];

const Center = () => {
    const { data: session } = useSession();
    const spotifyApi = useSpotify();
    const [color, setColor] = useState(null);
    const playlistId = useRecoilValue(playlistIdState);
    const [playlist, setPlaylist] = useRecoilState(playlistState);
    const [isActive, setActive] = useState('false');

    useEffect(() => {
        setColor(shuffle(colors).pop());
    }, [playlistId]);

    useEffect(() => {
        spotifyApi
            .getPlaylist(playlistId)
            .then((data) => {
                setPlaylist(data.body);
            }).catch((err) => console.log('Something went wrong!', err));
    }, [spotifyApi, playlistId]);

    const handleToggle = () => {
        setActive(!isActive);
    };

    return (
        <>
            <div className='flex-grow text-white h-screen overflow-y-scroll scrollbar-hide select-none relative'>
                <header className="absolute top-5 right-8" onClick={handleToggle}>
                    <div className="flex items-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 ... space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full pr-2">
                        <img
                            className="rounded-full w-10 p-1 h-10"
                            src={session?.user.image}
                            alt="user image"
                        />
                        <h2 className="text-white">{session?.user.name}</h2>
                    </div>
                </header>
                <section className={`flex items-end space-x-7 bg-gradient-to-b ${color} to-black h-80 text-white p-8 w-full`}>
                    <img className='h-44 w-44 shadow-2xl' src={playlist?.images?.[0]?.url} />
                    <div>
                        <p>PLAYLIST</p>
                        <h1 className='text-2xl md:text-3xl xl:text-5xl font-bold'>{playlist?.name}</h1>
                    </div>
                </section>
                <div>
                    <Songs/>
                </div>
            </div>
        </>
    )
}

export default Center;
