import { useEffect, useState } from 'react';
import { FaPlay } from "react-icons/fa";
import { genres } from '../utils/genres';
import { FaHeart, FaStar } from "react-icons/fa6";
import { Tomato } from '../components/tomato';
import { Imdb } from '../components/imdb';
import { fetchData, postData } from '../components/fetcher';
import { Section } from '../components/Section';
import { useAuthStore } from '../utils/useAuthStore';
import LikedMovies from '../utils/likedMovies';
import Arrow from '../components/Arrow';

export const Title = () => {
    const { user } = useAuthStore(); // ✅ Now has user object & login status
    const [recommendedTitles, setRecommendedTitles] = useState<Title[]>([]);
    const [title, setTitle] = useState<Title | null>(null);
    const [userRating, setUserRating] = useState<number>(0);
    const [hoverRating, setHoverRating] = useState<number | null>(null);
    const params = new URLSearchParams(window.location.search);
    const titleId = params.get('titleID');

    const getMovieData = async () => {
        const response = await fetchData({ path: `titles?show_id=${titleId}` });
        const movie = response[0];
        const movieGenres = Object.keys(movie).filter(key => genres.includes(key) && movie[key] === '1');
        return { ...movie, genres: movieGenres };
    };

    const getMovieRating = async (title: Title) => {
        const response = await fetchData({ path: `user-ratings?show_id=${title.show_id}&user_id=${user?.user_id}` });
        const rating = parseInt(response.rating)

        if (rating > 0) {
            setUserRating(rating);
        } else {
            setUserRating(0);
        };
    }

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

    const handleStarClick = async (rating: number) => {
        setUserRating(rating);

        console.log("✅ Sending payload:", {
            show_id: title?.show_id,
            user_id: user?.user_id,
            rating_id: rating
        });

        try {
            await postData({
                path: 'user-ratings',
                body: {
                    show_id: title?.show_id,
                    user_id: user?.user_id.toString(), // 👈 force test user
                    rating_id: rating,
                }
            });
        } catch (err) {
            console.error("❌ Rating failed:", err);
        }
    };


    useEffect(() => {
        const fetchMovieData = async () => {
            const movieData = await getMovieData();
            setTitle(movieData);

            getMovieRating(movieData);

            const similarMovies = await getSimilarMovies(movieData);

            const query = Object.entries(similarMovies)
                .filter(([key]) => key !== "title")
                .map(([, value]) => value as string);

            const response = await postData({
                path: 'titles',
                body: { titles: query }
            });

            setRecommendedTitles(response);
        };

        fetchMovieData();
    }, []);

    const Heart = ({ show_id }: { show_id: string }) => {
        const [liked, setLiked] = useState(false);

        const getStatus = async () => {
            const liked = await LikedMovies.checkIfLiked(show_id);
            setLiked(liked);
        }

        const handleClick = async () => {
            if (liked) {
                await LikedMovies.removeFromLikedMovies(show_id);
            } else {
                await LikedMovies.addToLikedMovies(show_id);
            }
            setLiked(!liked);
        };

        useEffect(() => {
            getStatus();
        }, [liked]);

        return (
            <div
                onClick={handleClick}
                className={`flex items-center ${liked ? 'bg-[#F25F5D] hover:bg-[#d44e4c]' : 'bg-transparent'} cursor-pointer backdrop-blur-sm justify-center rounded-full h-12 w-12 px-3 border border-[#F25F5D] group hover:bg-[#F25F5D] transition`}>
                <FaHeart size={24} className={`${liked ? 'text-[#191919]' : ' text-[#F25F5D]'} group-hover:text-[#191919]`} />
            </div>
        );
    };

    return (
        <div className="flex flex-col gap-4 justify-start items-center w-full min-h-screen bg-[#191919] text-white text-sm z-50 no-scrollbar overflow-auto pb-10 mb-8">
            <div className="flex flex-col items-start justify-center w-full h-full max-w-screen overflow-auto text-white gap-4 relative no-scrollbar mb-4">
                <img
                    src={`https://cdn.spotparking.app/public/posters/${title?.title}.jpg`}
                    alt={title?.title}
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = "https://cdn.spotparking.app/public/posters/fallbackImage.jpg";
                    }}
                    className="w-full object-cover aspect-video object-top"
                />

                <div className='absolute bottom-14 left-14 lg:bottom-20 lg:left-20 2xl:bottom-32 2xl:left-32 flex flex-col gap-5 z-20 w-1/2 no-scrollbar'>
                    {/* Metadata */}
                    <div className='flex flex-col justify-center items-start gap-3'>
                        <div className='flex flex-row justify-start text-[#ababab] text-shadow-md items-center gap-6'>
                            <p className='font-light text-lg'>{title?.genres.join(', ')}</p>
                        </div>

                        <p className='font-semibold text-4xl lg:text-6xl text-shadow-lg text-wrap'>{title?.title}</p>

                        <div className='flex flex-row justify-start text-[#ababab] text-shadow-md items-center'>
                            <p className='text-lg bg-[#383838] p-1 px-2 font-medium rounded mr-6'>{title?.rating}</p>
                            <p className='font-light text-lg'>{title?.release_year}</p>
                            <p className='text-lg font-medium px-3'>{title?.type === "Movie" && "•"}</p>
                            <p className='font-light text-lg'>{title?.type === 'Movie' && getDurationFromMinutes(title?.duration ?? '0')}</p>
                        </div>
                        <p className='font-light text-md lg:text-lg text-gray-200 text-shadow-lg w-3/4'>{title?.description}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className='flex flex-row justify-start items-center gap-4'>
                        <div
                            onClick={() => window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", '_blank')}
                            className='flex flex-row gap-2 w-fit items-center justify-between bg-[#EA8C55] rounded-full px-3 h-12 cursor-pointer group hover:shadow-lg transition hover:bg-[#BA6D40]'
                        >
                            <div className='bg-[#AF6A42] group-hover:bg-[#8C5433] rounded-full w-8 h-8 flex justify-center items-center'>
                                <FaPlay size={16} className="text-zinc-100" />
                            </div>
                            <p className='group-hover:text-gray-100 text-lg pr-1'>Play Now</p>
                        </div>
                        <div
                            onClick={() => window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", '_blank')}
                            className='flex flex-row gap-2 w-fit items-center justify-between bg-[#EA8C55] rounded-full px-3 h-12 cursor-pointer group hover:shadow-lg transition hover:bg-[#BA6D40]'
                        >
                            <p className='group-hover:text-gray-100 text-lg px-2'>Trailer</p>
                        </div>
                        <Heart show_id={title?.show_id ?? ''} />
                    </div>

                    {/* Ratings */}
                    {title && (
                        <div className='flex flex-row justify-start items-center gap-6 no-scrollbar'>
                            <div className="flex flex-row gap-1 items-center justify-start">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <FaStar
                                        key={star}
                                        size={22}
                                        onClick={() => handleStarClick(star)}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(null)}
                                        className={`
                                            cursor-pointer transition
                                            ${hoverRating !== null
                                                ? hoverRating >= star
                                                    ? 'text-yellow-400'
                                                    : 'text-[#969696]'
                                                : userRating >= star
                                                    ? 'text-yellow-400'
                                                    : 'text-[#969696]'}
                                        `}
                                    />
                                ))}
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

                <Arrow height={100} />
            </div>

            <span id={'scroll-target'} className='block h-0' />
            <Section
                title='More Like This'
                movies={recommendedTitles}
            />
        </div>
    );
};
