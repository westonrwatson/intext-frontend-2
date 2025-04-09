import React, {
    useState,
    useEffect,
    useCallback,
    ForwardedRef,
    forwardRef,
} from 'react'
import { useNavigate } from 'react-router-dom'
import { FiSearch } from 'react-icons/fi'
import Fuse from 'fuse.js'
import { fetchData } from './fetcher'

type SearchItem = {
    title: string
    path: string
    type?: string
    year?: number
}

type Props = {
    setSearchActive: (value: boolean) => void
    shouldHighlight?: boolean
    ref: ForwardedRef<HTMLInputElement>
}

const SearchBar = forwardRef<HTMLInputElement, Props>(({ setSearchActive, shouldHighlight }, ref) => {
    const [searchResults, setSearchResults] = useState<SearchItem[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [fuse, setFuse] = useState<Fuse<SearchItem> | null>(null);
    const navigate = useNavigate();
    const [query, setQuery] = useState('')

    const getResults = async (query: string) => {
        const response = await fetchData({ path: `search?q=${query}`, prod: true })
        return response
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (searchResults.length === 0) return
        if (e.key === 'Escape') {
            setSearchActive(false)
            setSearchResults([])
            setSelectedIndex(0)
            setTimeout(() => {
                (ref as React.RefObject<HTMLInputElement>)?.current?.blur()
            }, 0)
        } else
            if (e.key === 'ArrowDown') {
                e.preventDefault()
                setSelectedIndex((prev) => (prev + 1) % searchResults.length)
            } else if (e.key === 'ArrowUp') {
                e.preventDefault()
                setSelectedIndex((prev) =>
                    prev <= 0 ? searchResults.length - 1 : prev - 1
                )
            } else if (e.key === 'Enter' && selectedIndex >= 0) {
                e.preventDefault()
                const selectedItem = searchResults[selectedIndex]
                navigate(selectedItem.path)
                setSearchActive(false)
                setSearchResults([])
                setSelectedIndex(0)
                setTimeout(() => {
                    (ref as React.RefObject<HTMLInputElement>)?.current?.blur()
                }, 0)
            };
    };

    const handleSearchItemClick = useCallback((result: SearchItem) => {
        navigate(result.path)
        setSearchActive(false)
        setSearchResults([])
        setSelectedIndex(-1)
            ; (ref as React.RefObject<HTMLInputElement>)?.current?.blur()
    }, [navigate, setSearchActive, ref])

    useEffect(() => {
        if (!query) {
            setSearchResults([])
            setSelectedIndex(0)
            return
        };
        if (query.length < 2) return
        if (query.length > 20) return

        const fetchResults = async () => {
            const results = await getResults(query)
            setSearchResults(results)
        };

        fetchResults()
    }, [query])

    useEffect(() => {
        const selectedEl = document.querySelector(
            `.search-result-item[data-idx="${selectedIndex}"]`
        )
        if (selectedEl) {
            selectedEl.scrollIntoView({ block: 'nearest' })
        }
    }, [selectedIndex])

    useEffect(() => {
        if (shouldHighlight && ref && 'current' in ref && ref.current) {
            ref.current.select()
        }
    }, [shouldHighlight, ref])

    return (
        <div className="flex flex-col justify-center items-center absolute left-1/2 -translate-x-1/2 gap-2 w-1/2">
            <div
                className={`w-full shadow-md border-white py-4 bg-zinc-300 rounded-2xl flex flex-col justify-start items-center`}
                onClick={() => (ref as React.RefObject<HTMLInputElement>)?.current?.focus()}
            >
                <div className="flex flex-row justify-center items-center gap-2 w-full px-2">
                    <FiSearch size={18} className="text-stone-900" />
                    <input
                        type="text"
                        placeholder={'Search for movies, shows, and more'}
                        className="w-full h-full bg-transparent outline-none text-black text-xl"
                        ref={ref}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                </div>

                {searchResults.length > 0 && (
                    <>
                        <hr className="w-full border-t-2 border-stone-200 mt-4" />
                        <p className="text-sm font-semibold text-stone-400 mt-4 text-left w-full px-4">
                            Total results ({searchResults.length >= 50 ? '50+' : searchResults.length})
                        </p>
                        <div className="w-full p-4 pb-0 max-h-96 overflow-auto flex flex-col no-scrollbar">
                            {searchResults.map((result, idx) => (
                                <div
                                    key={idx}
                                    data-idx={idx}
                                    className={`search-result-item cursor-pointer px-3 py-3 flex justify-between items-center hover:bg-stone-100 rounded w-full ${idx === selectedIndex ? 'bg-stone-200' : ''
                                        }`}
                                    onMouseDown={(e) => {
                                        e.preventDefault()
                                        handleSearchItemClick(result)
                                    }}
                                >
                                    <div className="flex flex-row gap-2 items-center justify-center">
                                        <p className="text-sm font-medium text-black">
                                            {result.title}
                                        </p>
                                        {result && (
                                            <p className="text-xs font-normal text-stone-500">
                                                ({result.year})
                                            </p>
                                        )}
                                    </div>
                                    <p className="text-xs font-normal text-stone-500">
                                        {result.type}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
})

export default SearchBar