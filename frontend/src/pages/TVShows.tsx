import { useEffect, useState, useRef, useMemo } from 'react'
import { Title } from '../components/Title'
import { genres } from '../utils/genres'
import { fetchData } from '../components/fetcher'
import { useLocation } from 'react-router-dom'

const CHUNK_SIZE = 40

type Title = {
    title: string
    show_id: string
    type: string
    random_rating?: string
    [key: string]: string | undefined
}

export const TVShows = () => {
    const [allMovies, setAllMovies] = useState<Title[]>([]);
    const [visibleMovies, setVisibleMovies] = useState<Title[]>([]);
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const genreFromUrl = params.get("genre");
    const [selectedGenre, setSelectedGenre] = useState<string>(genreFromUrl || 'Action');
    const [scrollIndex, setScrollIndex] = useState(CHUNK_SIZE);
    const [loading, setLoading] = useState(true);
    const loaderRef = useRef<HTMLDivElement>(null);
    const genreRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

    useEffect(() => {
        const el = genreRefs.current[selectedGenre]
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
        }
      }, [selectedGenre])

    // Load movies from API on genre change
    useEffect(() => {
        setLoading(true);
        setScrollIndex(CHUNK_SIZE);

        const underscore = selectedGenre.replace(/ /g, "_");

        fetchData({ path: `titles?type=TV Show&genre=${underscore}&count=500` })
            .then(data => {
                const sorted: Title[] = (data as Title[])
                    .filter((movie: Title) => movie.title?.trim())
                    .sort((a: Title, b: Title) => a.title.localeCompare(b.title))

                setAllMovies(sorted)
                setVisibleMovies(sorted.slice(0, CHUNK_SIZE))
                setLoading(false)
            })
    }, [selectedGenre])

    // Lazy load more on scroll
    useEffect(() => {
        if (!loaderRef.current) return

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    loadMore()
                }
            },
            {
                root: null,
                rootMargin: '0px',
                threshold: 1.0,
            }
        );

        observer.observe(loaderRef.current)
        return () => observer.disconnect()
    }, [scrollIndex, allMovies])

    const loadMore = () => {
        const nextChunk = allMovies.slice(scrollIndex, scrollIndex + CHUNK_SIZE)
        if (nextChunk.length === 0) return
        setVisibleMovies(prev => [...prev, ...nextChunk])
        setScrollIndex(prev => prev + CHUNK_SIZE)
    };

    return (
        <div className="flex flex-col items-center min-h-screen justify-start bg-[#191919] no-scrollbar w-full gap-10 mt-10 py-20">
            <p className='font-semibold text-4xl -mt-5 -mb-5 text-shadow-lg select-none text-white'>TV Shows</p>

            <div className="w-screen relative overflow-hidden pb-2 pt-2">
                <div className="grid grid-rows-1 auto-cols-max grid-flow-col gap-4 px-8 overflow-x-auto no-scrollbar pr-12">
                {genres.map((genre, index) => {
                const isSelected = selectedGenre === genre
                const encoded = encodeURIComponent(genre)

                return (
                    <div
                    key={index}
                    ref={(el) => {
                        if (isSelected) genreRefs.current[genre] = el
                    }}
                    onClick={() => {
                        setSelectedGenre(genre)
                        window.history.pushState({}, '', `?genre=${encoded}`)
                    }}
                    className={`cursor-pointer select-none transition text-md px-6 py-4 min-w-[150px] max-w-[250px] rounded-lg flex items-center justify-center ${
                        isSelected ? 'bg-white text-black font-semibold' : 'bg-[#383838] text-white hover:bg-[#252525]'
                    }`}
                    >
                    <span className={`truncate select-none whitespace-nowrap overflow-hidden w-full text-center`}>
                        {genre}
                    </span>
                    </div>
                )
                })}
                </div>

                <div className="pointer-events-none absolute left-0 top-0 h-full w-8 bg-gradient-to-r from-[#191919] to-transparent z-10" />
                <div className="pointer-events-none absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-[#191919] to-transparent z-10" />
            </div>

            {loading && (
                <div className="w-full flex justify-center py-8">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white" />
                </div>
            )}

            {visibleMovies.length !== 0 ? (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 w-full px-8">
                    {visibleMovies.map((movie, index) => (
                    <div key={index} className="flex items-center justify-center">
                        <Title movie={movie} />
                    </div>
                    ))}
                    <div ref={loaderRef} className="w-[2px] h-full bg-transparent" />
                    <div className="pointer-events-none fixed bottom-0 left-0 w-full h-20 bg-gradient-to-t from-[#191919] to-transparent z-10" />
                </div>
                ) : (
                <div className="flex items-center select-none justify-center w-full h-full text-white text-lg font-semibold">
                    No shows found for this genre.
                </div>
                )}
        </div>
    )
}