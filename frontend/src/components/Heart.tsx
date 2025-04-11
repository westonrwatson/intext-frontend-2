import { useEffect, useState } from "react";
import LikedMovies from "../utils/likedMovies";
import { FaHeart } from "react-icons/fa6";

export const Heart = ({
    show_id,
    className = 'h-12 w-12 px-3',
    size = 24
}: {
    show_id: string
    className?: string
    size?: number
}) => {
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
            className={`flex items-center ${liked ? 'bg-[#F25F5D] hover:bg-[#d44e4c]' : 'bg-transparent'} cursor-pointer backdrop-blur-sm justify-center rounded-full ${className} border border-[#F25F5D] group hover:bg-[#F25F5D] transition`}>
            <FaHeart size={size} className={`${liked ? 'text-[#191919]' : ' text-[#F25F5D]'} group-hover:text-[#191919]`} />
        </div>
    );
};