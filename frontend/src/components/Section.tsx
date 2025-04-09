import { useEffect, useRef, useState } from "react";
import { Title } from "./Title";

const CHUNK_SIZE = 20;

export const Section = ({ title, movies }: { title: string, movies: Title[] }) => {
    const [visibleMovies, setVisibleMovies] = useState<Title[]>([])
    const [scrollIndex, setScrollIndex] = useState(CHUNK_SIZE)
    const loaderRef = useRef<HTMLDivElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    // Initial load
    useEffect(() => {
        if (movies.length > 0) {
            setVisibleMovies(movies.slice(0, CHUNK_SIZE))
            setScrollIndex(CHUNK_SIZE)
        }
    }, [movies])

    // Intersection observer for horizontal scroll
    useEffect(() => {
        if (!loaderRef.current || !containerRef.current) return

        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0]
                if (entry.isIntersecting) {
                    loadMore()
                }
            },
            {
                root: containerRef.current,
                threshold: 1.0,
            }
        );

        observer.observe(loaderRef.current)

        return () => observer.disconnect()
    }, [scrollIndex, movies])

    const loadMore = () => {
        const nextChunk = movies.slice(scrollIndex, scrollIndex + CHUNK_SIZE)
        if (nextChunk.length === 0) return;
        setVisibleMovies(prev => [...prev, ...nextChunk])
        setScrollIndex(prev => prev + CHUNK_SIZE)
    }

    return (
        <div className="flex flex-col items-start justify-center w-full overflow-hidden h-fit relative">
            <h2 className="text-2xl text-zinc-100 font-bold mb-4 px-8">{title}</h2>

            <div className="relative w-full">
                {/* Scrollable container */}
                <div
                    ref={containerRef}
                    className="flex flex-row gap-4 overflow-x-auto w-full min-w-0 px-8 relative scroll-smooth no-scrollbar"
                >
                    {visibleMovies.map((movie, index) => (
                        <Title key={index} movie={movie} />
                    ))}
                    <div ref={loaderRef} className="w-[2px] h-full bg-transparent" />
                </div>

                {/* Left fade */}
                <div className="pointer-events-none absolute top-0 left-0 h-full w-10 bg-gradient-to-r from-[#191919] to-transparent z-10" />

                {/* Right fade */}
                <div className="pointer-events-none absolute top-0 right-0 h-full w-16 bg-gradient-to-l from-[#191919] to-transparent z-10" />
            </div>
        </div>
    );
};