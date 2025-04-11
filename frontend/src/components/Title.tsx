import { Heart } from "./Heart";

export const Title = ({
    movie,
    title,
    full = true
}: {
    movie?: {
        title: string
        show_id: string
        random_rating?: string
        [key: string]: string | undefined
    },
    title?: {
        title: string
        show_id: string
    },
    full?: boolean
}) => {
    // this component is used to display a title in the home page and in the search page
    const cdnUrl = "https://cdn.spotparking.app/public/posters/";
    const handleClick = () => { window.location.href = movie ? `/title?titleID=${movie?.show_id}` : `/title?titleID=${title?.show_id}` };

    if (!movie) {
        return (
            <div key={title?.title} className={`flex-shrink-0 select-none w-48 flex flex-col gap-2 items-center justify-center h-fit overflow-hidden transition ${full ? '' : "scale-100"}`}>
                <img
                    src={`${cdnUrl}${title?.title}.jpg`}
                    draggable={false}
                    alt={title?.title}
                    loading="lazy"
                    onClick={handleClick}
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null; // Prevent looping
                        e.currentTarget.src = `${cdnUrl}fallbackImage.jpg`;
                    }}
                    className={`w-full aspect-[3/4] object-fill select-none overflow-hidden mb-2 rounded-lg ${full ? "hover:opacity-50" : 'shadow-xl'} cursor-pointer transition`}
                />
            </div>
        );
    } else {
        return (
            <div key={movie?.title} className={`flex-shrink-0 w-48 select-none flex flex-col gap-2 items-center justify-center h-fit overflow-hidden transition ${full ? '' : "scale-100"}`}>
                <img
                    src={`${cdnUrl}${movie.title}.jpg`}
                    draggable={false}
                    alt={movie.title}
                    loading="lazy"
                    onClick={handleClick}
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null; // Prevent looping
                        e.currentTarget.src = `${cdnUrl}fallbackImage.jpg`;
                    }}
                    className={`w-full aspect-[3/4] object-fill overflow-hidden select-none mb-2 rounded-lg ${full ? "hover:opacity-50" : 'shadow-xl'} cursor-pointer transition`}
                />
                {full && (
                    <div className="flex flex-row gap-2 items-start select-none justify-between w-full">
                        <div className="flex flex-col select-none gap-1">
                            <h2 onClick={handleClick} className="text-md text-ellipsis select-none cursor-pointer text-wrap line-clamp-2 overflow-clip text-white">{movie.title}</h2>
                        </div>
                        <Heart
                            show_id={movie.show_id}
                            className={'py-1 px-3'}
                            size={18}
                        />
                    </div>
                )}
            </div>
        );
    };
};