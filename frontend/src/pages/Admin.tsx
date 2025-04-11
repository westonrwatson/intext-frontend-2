import { useEffect, useRef, useState } from 'react';
import { fetchData } from '../components/fetcher';
import { genres } from '../utils/genres';
import { BiSolidPencil } from "react-icons/bi";
import { FiPlusCircle } from "react-icons/fi";
import { IoArrowDownOutline } from "react-icons/io5";
import { TypePicker } from './modals/TypePicker';
import { GenrePicker } from './modals/GenrePicker';
import AdminSearch from '../components/AdminSearch';
import { EditModal } from '../components/EditModal';
import { Toaster } from 'sonner';

export default function Admin() {
    const [data, setData] = useState<any[]>([]);
    const [pageSize, setPageSize] = useState(30);
    const [pageNumber, setPageNumber] = useState(0);
    const [sortBy, setSortBy] = useState('title');
    const [sortOrder, setSortOrder] = useState('desc');
    const [type, setType] = useState('');
    const [genre, setGenre] = useState('');

    const [showTypePicker, setShowTypePicker] = useState(false);
    const [showGenrePicker, setShowGenrePicker] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    useEffect(() => {
        const handleKeyDown = (event: any) => {
            if ((event.metaKey || event.ctrlKey) && event.key === "k") {
                event.preventDefault();
                searchActive ? setSearchActive(false) : setSearchActive(true);
            };

            if (event.key === "Escape") {
                event.preventDefault();
                setSearchActive(false);
            };
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    const getRows = async ({ pageSize, pageNumber, filters }: {
        pageSize: number;
        pageNumber: number;
        filters: {
            [key: string]: any;
        }
    }) => {
        const filterQuery = Object.entries(filters)
            .map(([key, value]) => `${key}=${value}`)
            .join('&');
        const pageQuery = `pageSize=${pageSize}&pageNumber=${pageNumber}`;
        const query = `${pageQuery}&${filterQuery}`;

        const response = await fetchData({ path: `getAllTitles?${query}` })

        if (response) {
            const newBuild = []
            for (const item of response) {
                const movieGenres = Object.keys(item).filter(key => genres.includes(key) && item[key] === 1)
                item.genres = movieGenres
                newBuild.push(item)
            }

            newBuild.sort((a, b) => {
                const aValue = a[sortBy];
                const bValue = b[sortBy];
                if (aValue < bValue) {
                    return sortOrder === 'desc' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortOrder === 'desc' ? 1 : -1;
                }
                return 0;
            });

            console.log(newBuild)

            setData(newBuild);
        } else {
            console.error('Failed to fetch data');
        }
    }


    const [searchActive, setSearchActive] = useState(false);
    const [searchQuery, setSearchQuery] = useState<string | undefined>('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const searchInputRef = useRef<HTMLInputElement | null>(null);
    const [highlightSearchInput, setHighlightSearchInput] = useState(false);

    useEffect(() => {
        if (searchQuery) {
            searchResults.sort((a, b) => {
                const aValue = a[sortBy];
                const bValue = b[sortBy];
                if (aValue < bValue) {
                    return sortOrder === 'desc' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortOrder === 'desc' ? 1 : -1;
                }
                return 0;
            });
            setData(searchResults || []);
            return;
        } else {
            const filtersObj = {
                type: type,
                genre: genre,
            }

            const filters = Object.fromEntries(
                Object.entries(filtersObj).filter(([_, value]) => value !== '')
            );

            getRows({
                pageSize,
                pageNumber: pageNumber,
                filters
            })
        }
    }, [pageSize, sortBy, sortOrder, type, genre, searchQuery, pageNumber, showEditModal]);

    useEffect(() => {
        const handleKeyDown = (event: any) => {
            if ((event.metaKey || event.ctrlKey) && event.key === "k") {
                event.preventDefault();
                searchActive ? setSearchActive(false) : setSearchActive(true);
            };

            if (event.key === "Escape") {
                event.preventDefault();
                setSearchActive(false);
            };
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    useEffect(() => {
        if (searchActive) {
            if (searchInputRef.current) {
                searchInputRef.current.focus();
            }
            setHighlightSearchInput(true);
        } else {
            if (searchInputRef.current) {
                searchInputRef.current.blur();
            }
            setHighlightSearchInput(false);
        };
    }, [searchActive]);

    const [activeTitle, setActiveTitle] = useState<Title | null>(null);

    return (
        <div className='text-white bg-[#191919] px-10 flex flex-col gap-10 h-full'>
            <h1 className='text-5xl font-bold pt-28'>Manage Movies</h1>
            <div className='flex flex-row justify-between gap-6 items-center bg-transparent p-4 rounded-lg'>
                <div className='flex flex-row gap-4 items-center justify-center'>
                    <div
                        onClick={() => {
                            setActiveTitle(null);
                            setShowEditModal(true);
                        }}
                        className="text-white h-12 px-6 bg-[#383838] rounded-lg hover:bg-[#252525] transition-all duration-200 flex flex-row gap-2 items-center cursor-pointer"
                    >
                        <FiPlusCircle size={24} className="text-[#ABABAB] text-md" />
                        <p className='text-xl text-[#ABABAB]'>Add Title</p>
                    </div>
                </div>
                <AdminSearch
                    ref={searchInputRef}
                    setSearchActive={setSearchActive}
                    shouldHighlight={highlightSearchInput}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    searchResults={searchResults}
                    setSearchResults={setSearchResults}
                />
            </div>

            {/* Scrollable table wrapper */}
            <div className="overflow-y-auto rounded-b-2xl no-scrollbar" style={{ maxHeight: 'calc(100vh - 370px)' }}>
                <table className="bg-black w-full">
                    <thead className="sticky top-0 bg-[#191919]">
                        <tr>
                            <th className="border border-[#191919] border-y-0  text-left font-light text-[#ABABAB] px-4 py-2">Edit</th>
                            <th className="border border-[#191919] border-y-0 text-left group font-light text-[#ABABAB] px-4 py-2">
                                <div className="flex flex-row justify-between gap-2 items-center">
                                    <p>Title</p>
                                    <IoArrowDownOutline
                                        className={`${sortBy === 'title' ? (sortOrder === 'asc' ? 'rotate-180' : '') : 'text-[#191919]'} cursor-pointer group-hover:text-[#ccc]`}
                                        onClick={() => {
                                            setSortBy('title');
                                            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                                        }}
                                    />
                                </div>
                            </th>
                            <th className="border border-[#191919] border-y-0  text-left group font-light text-[#ABABAB] px-4 py-2">
                                <div className="flex flex-row justify-between gap-2 items-center relative">
                                    <p className='cursor-pointer' onClick={() => setShowTypePicker(true)}>Type</p>
                                    <IoArrowDownOutline
                                        className={`${sortBy === 'type' ? (sortOrder === 'asc' ? 'rotate-180' : '') : 'text-[#191919]'} cursor-pointer group-hover:text-[#ccc]`}
                                        onClick={() => {
                                            setSortBy('type');
                                            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                                        }}
                                    />

                                    {showTypePicker && (
                                        <TypePicker
                                            type={type}
                                            setType={setType}
                                            setShowPicker={setShowTypePicker}
                                        />
                                    )}

                                </div>
                            </th>
                            <th className="border border-[#191919] border-y-0  text-left group font-light text-[#ABABAB] px-4 py-2">
                                <div className="flex flex-row justify-between gap-2 items-center">
                                    <p>Year</p>
                                </div>
                            </th>
                            <th className="border border-[#191919] border-y-0  text-left group font-light text-[#ABABAB] px-4 py-2">
                                <div className="flex flex-row justify-between gap-2 items-center relative">
                                    <p className='cursor-pointer' onClick={() => setShowGenrePicker(true)}>Genre</p>

                                    {showGenrePicker && (
                                        <GenrePicker
                                            type={genre}
                                            setType={setGenre}
                                            setShowPicker={setShowGenrePicker}
                                        />
                                    )}
                                </div>
                            </th>
                            <th className="border border-[#191919] border-y-0  text-left group font-light text-[#ABABAB] px-4 py-2">
                                <div className="flex flex-row justify-between gap-2 items-center">
                                    <p>Duration</p>
                                </div>
                            </th>
                            <th className="border border-[#191919] border-y-0  text-left group font-light text-[#ABABAB] px-4 py-2">
                                <div className="flex flex-row justify-between gap-2 items-center">
                                    <p>Rating</p>
                                    <IoArrowDownOutline
                                        className={`${sortBy === 'rating' ? (sortOrder === 'asc' ? 'rotate-180' : '') : 'text-[#191919]'} cursor-pointer group-hover:text-[#ccc]`}
                                        onClick={() => {
                                            setSortBy('rating');
                                            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                                        }}
                                    />
                                </div>
                            </th>
                            <th className="border border-[#191919] border-y-0  text-left group font-light text-[#ABABAB] px-4 py-2">
                                <div className="flex flex-row justify-between gap-2 items-center">
                                    <p>Country</p>
                                    <IoArrowDownOutline
                                        className={`${sortBy === 'country' ? (sortOrder === 'asc' ? 'rotate-180' : '') : 'text-[#191919]'} cursor-pointer group-hover:text-[#ccc]`}
                                        onClick={() => {
                                            setSortBy('country');
                                            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                                        }}
                                    />
                                </div>
                            </th>
                            <th className="border border-[#191919] border-y-0 text-left group font-light text-[#ABABAB] px-4 py-2">
                                <div className="flex flex-row justify-between gap-2 items-center">
                                    <p>Director</p>
                                    <IoArrowDownOutline
                                        className={`${sortBy === 'director' ? (sortOrder === 'asc' ? 'rotate-180' : '') : 'text-[#191919]'} cursor-pointer group-hover:text-[#ccc]`}
                                        onClick={() => {
                                            setSortBy('director');
                                            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                                        }}
                                    />
                                </div>
                            </th>
                        </tr>
                    </thead>
                    {data.length === 0 ? (
                        <tbody>
                            <tr>
                                <td colSpan={9} className="flex flex-col justify-center items-center w-full h-64">
                                    <p className="text-[#ABABAB] w-full text-2xl font-light text-center">No data available</p>
                                </td>
                            </tr>
                        </tbody>
                    ) : (
                        <tbody>
                            {data.map((item, index) => (
                                <tr key={item.show_id || item.title} className='text-[#ABABAB] hover:bg-[#383838] transition-all duration-200'>
                                    <td className="border border-[#191919] text-left font-light px-4 py-2">
                                        <div
                                            onClick={() => {
                                                setActiveTitle(item);
                                                setShowEditModal(true);
                                            }}
                                            className="bg-[#333] text-white p-2 rounded-lg hover:bg-[#444] transition-all duration-200 shadow-md cursor-pointer"
                                        >
                                            <BiSolidPencil size={20} className="text-[#ABABAB] text-2xl" />
                                        </div>
                                    </td>
                                    <td className="border border-[#191919] text-left font-light px-4 py-2">{item.title}</td>
                                    <td className="border border-[#191919] text-left font-light px-4 py-2">{item.type}</td>
                                    <td className="border border-[#191919] text-left font-light px-4 py-2">{item.release_year}</td>
                                    <td className="border border-[#191919] text-left font-light px-4 py-2">{Array.isArray(item.genres) ? item.genres.join(", ") : ""}</td>
                                    <td className="border border-[#191919] text-left font-light px-4 py-2">{item.duration}</td>
                                    <td className="border border-[#191919] text-left font-light px-4 py-2">{item.rating}</td>
                                    <td className="border border-[#191919] text-left font-light px-4 py-2">{typeof item.country === 'object' ? "N/A" : item.country}</td>
                                    <td className="border border-[#191919] text-left font-light px-4 py-2">{typeof item.director === 'object' ? 'N/A' : item.director}</td>
                                </tr>
                            ))}
                        </tbody>
                    )}
                </table>
            </div>

            {/* Pagination Footer */}
            <div className="sticky bottom-0 w-full bg-[#191919] py-4 z-10 flex justify-between items-center border-t border-[#383838]">
                <div className="flex flex-row gap-8 justify-center w-full items-center">
                    <button
                        disabled={pageNumber === 0}
                        onClick={() => setPageNumber((prev) => Math.max(0, prev - 1))}
                        className={`w-24  select-none py-2 rounded-lg text-[#ABABAB] bg-[#333] hover:bg-[#444] transition ${pageNumber === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                            }`}
                    >
                        Previous
                    </button>
                    <p className="text-[#ABABAB]">Page {pageNumber + 1}</p>
                    <button
                        onClick={() => setPageNumber((prev) => prev + 1)}
                        className="w-24 select-none  py-2 rounded-lg text-[#ABABAB] bg-[#383838] hover:bg-[#444] transition cursor-pointer"
                    >
                        Next
                    </button>
                    <div className='bg-[#383838] text-md rounded-lg flex flex-row gap-2 h-10 px-4 items-center absolute right-0'>
                        <p className='text-[#ABABAB]'>Page Size:</p>
                        <select
                            className='flex flex-row text-[#ABABAB] outline-none cursor-pointer'
                            value={pageSize}
                            onChange={(e) => setPageSize(Number(e.target.value))}
                            id="pageSize"
                            name="pageSize"
                        >
                            <option value={25} style={{ backgroundColor: '#383838', color: '#ABABAB' }}>30</option>
                            <option value={50} style={{ backgroundColor: '#383838', color: '#ABABAB' }}>50</option>
                            <option value={100} style={{ backgroundColor: '#383838', color: '#ABABAB' }}>100</option>
                            <option value={200} style={{ backgroundColor: '#383838', color: '#ABABAB' }}>200</option>
                        </select>
                    </div>
                </div>
            </div>

            {showEditModal && (
                <EditModal
                    title={activeTitle}
                    setTitle={setActiveTitle}
                    setModalOpen={setShowEditModal}
                />
            )}
            <Toaster position="top-center" richColors />
        </div >
    );
}
