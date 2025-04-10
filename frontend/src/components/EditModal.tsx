import { useState } from "react";
import { patchData, postData } from "./fetcher";
import { genreKeyMapValues } from "../utils/genres";
import { toast, Toaster } from "sonner"

export const EditModal = ({ title, setTitle, setModalOpen }: {
    title: Title | null;
    setTitle: (title: Title | null) => void;
    setModalOpen: (value: boolean) => void;
}) => {
    const [error, setError] = useState<string | null>(null);
    const [newTitle, setNewTitle] = useState<Title | null>(title);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleFieldChange = async (
        field: keyof Title,
    ) => {
        if (newTitle?.[field] === title?.[field]) {
            return;
        }

        const payload = {
            show_id: title?.show_id,
            [field]: newTitle?.[field],
        }

        console.log(payload)

        const response = await patchData({
            path: "patch-movie",
            body: payload
        })

        if (response.error) {
            setError(response.error);
        } else {
            setTitle({
                ...title,
                [field]: newTitle?.[field],
            } as Title);
            setNewTitle({
                ...title,
                [field]: newTitle?.[field],
            } as Title);

            toast.success("Title updated successfully", {
                duration: 2000,
                style: {
                    background: "#191919",
                    color: "#fff",
                    border: "2px solid #383838",
                },
            });
        };
    };

    const handleDelete = async () => {
        const response = await postData({
            path: "delete-movie",
            body: {
                show_id: title?.show_id,
            }
        });

        if (response.error) {
            setError(response.error);
        } else {
            toast.success("Title deleted successfully", {
                duration: 2000,
                style: {
                    background: "#191919",
                    color: "#fff",
                    border: "2px solid #383838",
                },
            });
            setTitle(null);
            setModalOpen(false);
        };
    };

    const handleAddTitle = async () => {
        if (!newTitle) {
            setError("New title data is missing");
            return;
        }

        const emptyObj = {
            type: "",
            title: "",
            director: "",
            cast: "",
            country: "",
            release_year: 0,
            rating: "",
            duration: "",
            description: "",
            Action: 0,
            Adventure: 0,
            Anime_Series_International_TV_Shows: 0,
            British_TV_Shows_Docuseries_International_TV_Shows: 0,
            Children: 0,
            Comedies: 0,
            Comedies_Dramas_International_Movies: 0,
            Comedies_International_Movies: 0,
            Comedies_Romantic_Movies: 0,
            Crime_TV_Shows_Docuseries: 0,
            Documentaries: 0,
            Documentaries_International_Movies: 0,
            Docuseries: 0,
            Dramas: 0,
            Dramas_International_Movies: 0,
            Dramas_Romantic_Movies: 0,
            Family_Movies: 0,
            Fantasy: 0,
            Horror_Movies: 0,
            International_Movies_Thrillers: 0,
            International_TV_Shows_Romantic_TV_Shows_TV_Dramas: 0,
            "Kids'_TV": 0,
            Language_TV_Shows: 0,
            Musicals: 0,
            Nature_TV: 0,
            Reality_TV: 0,
            Spirituality: 0,
            TV_Action: 0,
            TV_Comedies: 0,
            TV_Dramas: 0,
            Talk_Shows_TV_Comedies: 0,
            Thrillers: 0,
            random_rating: 0,
            tomatoRating: 0,
            imdbRating: 0,
        }

        const newTitleData = Object.keys(emptyObj).reduce((acc: Partial<typeof emptyObj>, key) => {
            const normalizedKey = key.replace(/_/g, " ");
            acc[key as keyof typeof emptyObj] = newTitle?.[key as keyof typeof emptyObj] ?? newTitle?.[normalizedKey as keyof typeof emptyObj] ?? emptyObj[key as keyof typeof emptyObj];
            return acc;
        }, {} as Partial<typeof emptyObj>);

        try {
            console.log("📤 Sending:", newTitleData);
            const response = await postData({
                path: "add-movie",
                body: newTitleData
            });

            if (response.error) {
                setError(response.error);
            } else {
                toast.success("Title added successfully", {
                    duration: 2000,
                    style: {
                        background: "#191919",
                        color: "#fff",
                        border: "2px solid #383838",
                    },
                });
                setTitle(null);
                setModalOpen(false);
            }
        } catch (err) {
            console.error("❌ Error adding title:", err);
            setError("Something went wrong while adding the title.");
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-[#00000050]">
            <div className="bg-[#191919] text-[#ABABAB] rounded-lg shadow-lg p-8 w-full max-w-xl gap-5 flex flex-col">
                <h2 className="text-xl font-semibold ">Edit Title</h2>
                <div className="">
                    <label htmlFor="title" className="block text-sm font-medium">Type</label>
                    <div className="flex flex-row gap-4">
                        <label className="flex flex-row gap-2 text-nowrap">
                            <input
                                type="radio"
                                value="Movie"
                                className="text-nowrap w-fit accent-[#E8AF58]"
                                checked={newTitle?.type === "Movie"}
                                onChange={() => { title ? handleFieldChange("type") : setNewTitle({ ...newTitle, type: "Movie" } as Title) }}
                            />
                            Movie
                        </label>
                        <label className="flex flex-row gap-2 text-nowrap">
                            <input
                                type="radio"
                                value="TV Show"
                                className="text-nowrap w-fit accent-[#E8AF58]"
                                checked={newTitle?.type === "TV Show"}
                                onChange={() => { title ? handleFieldChange("type") : setNewTitle({ ...newTitle, type: "TV Show" } as Title) }}
                            />
                            TV Show
                        </label>
                    </div>
                </div>
                <div className="">
                    <label htmlFor="title" className="block text-sm font-medium">Title</label>
                    <input
                        type="text"
                        id="title"
                        value={newTitle?.title}
                        onChange={(e) => setNewTitle({ ...newTitle, title: e.target.value } as Title)}
                        onBlur={(e) => { title && handleFieldChange("title") }}
                        className="mt-1 block w-full border-2 border-[#383838] rounded-md p-2 h-10 outline-[#E8AF58]"
                    />
                </div>
                <div className="flex flex-row gap-4 w-full">
                    <div className="flex-grow">
                        <label htmlFor="director" className="block text-sm font-medium">Director</label>
                        <input
                            type="text"
                            id="director"
                            value={newTitle?.director}
                            onChange={(e) => setNewTitle({ ...newTitle, director: e.target.value } as Title)}
                            onBlur={(e) => { title && handleFieldChange("director") }}
                            className="mt-1 block w-full border-2 border-[#383838] rounded-md p-2 h-10 outline-[#E8AF58]"
                        />
                    </div>
                    <div className="">
                        <label htmlFor="cast" className="block text-sm font-medium">Cast</label>
                        <input
                            type="text"
                            id="cast"
                            value={newTitle?.cast}
                            onChange={(e) => setNewTitle({ ...newTitle, cast: e.target.value } as Title)}
                            onBlur={(e) => { title && handleFieldChange("cast") }}
                            className="mt-1 block w-full border-2 border-[#383838] rounded-md p-2 h-10 outline-[#E8AF58]"
                        />
                    </div>
                </div>
                <div className="flex flex-row gap-4 w-full">
                    <div className="">
                        <label htmlFor="country" className="block text-sm font-medium">Country</label>
                        <input
                            type="text"
                            id="country"
                            value={newTitle?.country}
                            onChange={(e) => setNewTitle({ ...newTitle, country: e.target.value } as Title)}
                            onBlur={(e) => { title && handleFieldChange("country") }}
                            className="mt-1 block w-full border-2 border-[#383838] rounded-md p-2 h-10 outline-[#E8AF58]"
                        />
                    </div>
                    <div className=" flex-grow">
                        <label htmlFor="releaseYear" className="block text-sm font-medium">Release Year</label>
                        <input
                            type="number"
                            id="releaseYear"
                            value={newTitle?.release_year}
                            onChange={(e) => setNewTitle({ ...newTitle, release_year: e.target.value } as Title)}
                            onBlur={(e) => { title && handleFieldChange("release_year") }}
                            min="1900"
                            max={new Date().getFullYear()}
                            className="mt-1 block w-full border-2 border-[#383838] rounded-md p-2 h-10 outline-[#E8AF58]"
                        />
                    </div>
                </div>
                <div className="flex flex-row gap-4 w-full">
                    <div className=" flex-grow">
                        <label htmlFor="rating" className="block text-sm font-medium">Rating</label>
                        <select
                            id="rating"
                            value={newTitle?.rating}
                            onBlur={(e) => { title && handleFieldChange("rating") }}
                            onChange={(e) => setNewTitle({ ...newTitle, rating: e.target.value } as Title)}
                            className="mt-1 block w-full border-2 border-[#383838] rounded-md p-2 h-10 outline-[#E8AF58]"
                        >
                            <option value="">Select Rating</option>
                            <option value="G">G</option>
                            <option value="PG">PG</option>
                            <option value="PG-13">PG-13</option>
                            <option value="R">R</option>
                            <option value="NC-17">NC-17</option>
                            <option value="Unrated">Unrated</option>
                            <option value="TV-G">TV-G</option>
                            <option value="TV-PG">TV-PG</option>
                            <option value="TV-14">TV-14</option>
                            <option value="TV-MA">TV-MA</option>
                            <option value="TV-Y">TV-Y</option>
                            <option value="TV-Y7">TV-Y7</option>
                        </select>
                    </div>
                    <div className="">
                        <label htmlFor="duration" className="block text-sm font-medium">Duration (min)</label>
                        <input
                            type="number"
                            id="duration"
                            value={newTitle?.duration?.split(" ")[0] || ""}
                            onChange={(e) => setNewTitle({ ...newTitle, duration: `${e.target.value} min` } as Title)}
                            onBlur={(e) => { title && handleFieldChange("duration") }}
                            className="mt-1 block w-full border-2 border-[#383838] rounded-md p-2 h-10 outline-[#E8AF58]"
                        />
                    </div>
                </div>

                <div className="">
                    <label htmlFor="description" className="block text-sm font-medium">Description</label>
                    <textarea
                        id="description"
                        value={newTitle?.description}
                        onChange={(e) => setNewTitle({ ...newTitle, description: e.target.value } as Title)}
                        onBlur={(e) => { title && handleFieldChange("description") }}
                        className="mt-1 block w-full border-2 border-[#383838] rounded-md p-2 h-24"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4 w-full h-64 overflow-scroll no-scrollbar">
                    {genreKeyMapValues.map((genre) => {
                        const genreWithSpaces = genre.split("_").join(" ");
                        return (
                            <div key={genre} className="flex flex-row gap-2 items-center">
                                <input
                                    type="checkbox"
                                    id={genre}
                                    value={genre}
                                    className="accent-[#E8AF58]"
                                    checked={!!(newTitle && (newTitle[genre] === '1' || newTitle[genre] === 1))}
                                    onChange={() => {
                                        const currentVal = newTitle?.[genre];
                                        const newVal = currentVal === '1' || currentVal === 1 ? 0 : 1;

                                        setNewTitle({
                                            ...newTitle,
                                            [genre]: newVal,
                                        } as Title);

                                        // Optional: update backend immediately if editing an existing title
                                        if (title) handleFieldChange(genre);
                                    }}
                                />
                                <label htmlFor={genre} className="text-sm font-medium">{genreWithSpaces}</label>
                            </div>
                        )
                    })}
                </div>

                {error && (
                    <div className="w-full flex justify-center items-center">
                        <p className="bg-[#2e2e2e] border border-[#EA8C55] text-gray-100 w-fit text-center text-xs mt-1 py-2 px-4 rounded-lg">
                            {error}
                        </p>
                    </div>
                )}

                <div className="flex flex-row gap-4 justify-between">
                    <div
                        onClick={() => setModalOpen(false)}
                        className="bg-[#383838] hover:bg-[#252525] text-white px-4 py-2 rounded-md transition duration-200 cursor-pointer"
                    >
                        Close
                    </div>
                    <div
                        onClick={() => {
                            if (title) {
                                setShowDeleteModal(true)
                            } else {
                                handleAddTitle();
                            }
                        }}
                        className={`bg-[#191919] border-2 ${title ? 'border-red-400 hover:bg-red-400' : 'border-[#E8AF58] hover:bg-[#E8AF58]'} text-white px-4 py-1 flex justify-center items-center hover:text-[#383838] rounded-md transition duration-200 cursor-pointer`}
                    >
                        {title ? "Delete" : "Add"}
                    </div>
                </div>
            </div>

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-[#00000050]">
                    <div className="bg-[#191919] text-[#ABABAB] rounded-lg shadow-lg p-8 w-full max-w-2xl gap-5 flex flex-col">
                        <h2 className="text-xl font-semibold ">Are you sure you want to delete this title?</h2>
                        <p className="text-red-500">This action cannot be undone.</p>
                        <div className="flex flex-row gap-4 justify-between">
                            <div
                                onClick={() => setShowDeleteModal(false)}
                                className="bg-[#383838] hover:bg-[#252525] text-white px-4 py-2 rounded-md transition duration-200 cursor-pointer"
                            >
                                Cancel
                            </div>
                            <div
                                onClick={handleDelete}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 flex justify-center items-center rounded-md transition duration-200 cursor-pointer"
                            >
                                Delete
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <Toaster position="top-center" />
        </div>
    )
}