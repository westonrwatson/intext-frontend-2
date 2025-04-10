import React, {
    useState,
    useEffect,
    ForwardedRef,
    forwardRef,
} from 'react'
import { useNavigate } from 'react-router-dom'
import { FiSearch } from 'react-icons/fi'
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
    searchQuery?: string
    setSearchQuery: (value: string) => void
    searchResults: SearchItem[]
    setSearchResults: (value: SearchItem[]) => void
}

const AdminSearch = forwardRef<HTMLInputElement, Props>(({
    setSearchActive,
    shouldHighlight,
    searchQuery,
    setSearchQuery,
    searchResults,
    setSearchResults,
}, ref) => {
    const getResults = async (query: string) => {
        const response = await fetchData({ path: `superSearch?q=${query}` })
        console.log(response)
        return response
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (searchResults.length === 0) return
        if (e.key === 'Escape') {
            setSearchActive(false)
            setSearchResults([])
            setTimeout(() => {
                (ref as React.RefObject<HTMLInputElement>)?.current?.blur()
            }, 0)
        } else
            if (e.key === 'Enter') {
                e.preventDefault()
                setSearchActive(false)
                setTimeout(() => {
                    (ref as React.RefObject<HTMLInputElement>)?.current?.blur()
                }, 0)
            };
    };

    useEffect(() => {
        if (!searchQuery) {
            setSearchResults([])
            return
        };
        if (searchQuery.length < 2) return
        if (searchQuery.length > 20) return

        const fetchResults = async () => {
            const results = await getResults(searchQuery)
            setSearchResults(results)
        };

        fetchResults()
    }, [searchQuery])

    useEffect(() => {
        if (shouldHighlight && ref && 'current' in ref && ref.current) {
            ref.current.select()
        }
    }, [shouldHighlight, ref])

    return (
        <div className="flex flex-col justify-center items-center w-96">
            <div
                className={`w-full shadow-md border-white py-3 bg-zinc-300 rounded-full flex flex-col justify-start items-center`}
                onClick={() => (ref as React.RefObject<HTMLInputElement>)?.current?.focus()}
            >
                <div className="flex flex-row justify-center items-center gap-2 w-full px-4">
                    <FiSearch size={24} className="text-stone-900" />
                    <input
                        type="text"
                        placeholder={'Search for movies, shows, and more'}
                        className="w-full h-full bg-transparent outline-none text-black text-md"
                        ref={ref}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                </div>
            </div>
        </div>
    )
})

export default AdminSearch