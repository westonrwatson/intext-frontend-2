import { useEffect, useState } from 'react';
import { FaPlay } from "react-icons/fa";
import { genres } from '../utils/genres';
import { FaHeart } from "react-icons/fa6";
import { FaStar } from "react-icons/fa6";
import { Tomato } from '../components/tomato';
import { Imdb } from '../components/imdb';
import { fetchData, postData } from '../components/fetcher';
import { Section } from '../components/Section';

export const Title = () => {
    const [recommendedTitles, setRecommendedTitles] = useState<Title[]>([]);
    const [title, setTitle] = useState<Title | null>(null);
    const params = new URLSearchParams(window.location.search);
    const titleId = params.get('titleID');
    const numFullStar = parseInt(title?.random_rating ?? '0');
    const numEmptyStar = 5 - numFullStar;

    const getMovieData = async () => {
        const response = await fetchData({ path: `titles?show_id=${titleId}` });
        const title = response[0];
        const movieGenres = Object.keys(title).filter(key => genres.includes(key) && title[key] === '1')
        const fullTitle = { ...title, genres: movieGenres }
        return fullTitle;
    };

    const getSimilarMovies = async (title: Title) => {
        const response = await fetchData({ path: `similar-movies?title=${title.title}` });
        return response;
    };

    const getDurationFromMinutes = (minutes: string) => {
        const parsedMinutes = parseInt(minutes);
        const hours = Math.floor(parsedMinutes / 60);
        const minutesLeft = parsedMinutes % 60;
        return `${hours}h ${minutesLeft}m`;
    };

    useEffect(() => {
        const fetchMovieData = async () => {
            const movieData = await getMovieData();
            setTitle(movieData);

            const similarMovies = await getSimilarMovies(movieData);

            const query = Object.entries(similarMovies)
                .filter(([key]) => key !== "title") // Exclude the original title
                .map(([, value]) => value as string)

            const payload = { titles: query }

            const response = await postData({
                path: 'titles',
                body: payload
            });

            setRecommendedTitles(response);
        };

        fetchMovieData();
    }, []);

    return (
        <div className="flex flex-col gap-4 justify-start min-h-screen items-center w-full py-20 bg-[#191919] text-white text-sm p-4 z-50 no-scrollbar overflow-auto">
            <div className="flex flex-col items-start justify-center w-full h-[calc(80%-20px)] overflow-auto text-white gap-4 relative rounded-xl mt-2 no-scrollbar">
                <img
                    src={`https://cdn.spotparking.app/public/posters/${title?.title}.jpg`}
                    alt={title?.title}
                    onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.onerror = null
                        target.src = "https://cdn.spotparking.app/public/posters/fallbackImage.jpg"
                    }}
                    className="w-full object-cover aspect-video object-top"
                    style={{}}
                />
                <div className='absolute bottom-20 left-20 flex flex-col gap-5 z-20 w-1/2 no-scrollbar'>
                    {/* Rating / genres */}
                    <div className='flex flex-col justify-center items-start gap-3'>
                        <div className='flex flex-row justify-start text-[#ababab] text-shadow-md items-center gap-6'>
                            <p className='font-light text-lg'>{title?.genres.join(', ')}</p>
                        </div>

                        <p className='font-semibold text-6xl text-shadow-lg text-wrap'>{title?.title}</p>
                        {/* Title, description */}
                        <div className='flex flex-row justify-start text-[#ababab] text-shadow-md items-center'>
                            <p className='text-lg bg-[#383838] p-1 px-2 font-medium rounded mr-6'>{title?.rating}</p>
                            <p className='font-light text-lg'>{title?.release_year}</p>
                            <p className='text-lg font-medium px-3'>•</p>
                            <p className='font-light text-lg'>{getDurationFromMinutes(title?.duration ?? '0')}</p>
                        </div>
                        <p className='font-light text-lg text-gray-200 text-shadow-lg w-3/4'>{title?.description}</p>
                    </div>

                    {/* Play buttons etc */}
                    <div className='flex flex-row justify-start items-center gap-4'>
                        <div className='flex flex-row gap-2 w-fit items-center justify-between bg-[#EA8C55] rounded-full px-3 h-12 cursor-pointer group hover:shadow-lg transition hover:bg-[#BA6D40]'>
                            <div className='bg-[#AF6A42] group-hover:bg-[#8C5433] rounded-full w-8 h-8 flex justify-center items-center'>
                                <FaPlay size={16} className="text-zinc-100" />
                            </div>
                            <p className='group-hover:text-gray-100 text-lg pr-1'>Play Now</p>
                        </div>
                        <div className='flex flex-row gap-2 w-fit items-center justify-between bg-[#EA8C55] rounded-full px-3 h-12 cursor-pointer group hover:shadow-lg transition hover:bg-[#BA6D40]'>
                            <p className='group-hover:text-gray-100 text-lg px-2'>Trailer</p>
                        </div>
                        <div className='flex backdrop-blur-sm flex-row gap-2 items-center justify-center bg-transparent h-12 w-12 border border-[#F25F5D] rounded-full px-3 cursor-pointer group hover:shadow-lg transition hover:bg-[#F25F5D]'>
                            <FaHeart size={24} className="text-[#F25F5D] group-hover:text-[#191919]" />
                        </div>
                    </div>

                    {/* Ratings */}
                    {title && (
                        <div className='flex flex-row justify-start items-center gap-6 no-scrollbar'>
                            <div className="flex flex-row gap-1 items-center justify-start">
                                {title?.random_rating && (
                                    <>
                                        {Array.from({ length: numFullStar }).map((_, index) => (
                                            <FaStar key={index} size={18} className="text-[#F4AC45]" />
                                        ))}
                                        {Array.from({ length: numEmptyStar }).map((_, index) => (
                                            <FaStar key={index} size={18} className="text-[#969696]" />
                                        ))}
                                    </>
                                )}
                            </div>
                            <a href={`https://www.rottentomatoes.com/m/${title?.title?.replace(/ /g, '_')}`} target="_blank" rel="noopener noreferrer" className='flex flex-row gap-1 justify-center items-center cursor-pointer'>
                                <Tomato />
                                <p className='text-[#ABABAB]'>{title?.tomatoRating}%</p>
                            </a>
                            <a href={`https://www.imdb.com/find/?q=${title?.title}`} target="_blank" rel="noopener noreferrer" className='flex flex-row gap-1 justify-center items-center cursor-pointer'>
                                <Imdb />
                                <p className='text-[#ABABAB]'>{title?.imdbRating}/10</p>
                            </a>
                        </div>
                    )}
                </div>
                <div className="pointer-events-none absolute top-0 left-0 h-full w-full opacity-100 bg-gradient-to-r from-[#191919] to-transparent z-10" />
                <div className="pointer-events-none absolute right-0 bottom-0 h-48 w-full z-10 bg-gradient-to-t from-[#191919] to-transparent" />
            </div>

            <Section
                title='More Like This'
                movies={recommendedTitles}
            />
        </div >
    );
};