import { useState } from "react";
import { HiMiniXMark } from "react-icons/hi2";

export const TypePicker = ({ type, setType, setShowPicker }: {
    type: string;
    setType: (type: string) => void;
    setShowPicker: (show: boolean) => void;
}) => {
    const [selectedType, setSelectedType] = useState(type);

    return (
        <div className="absolute z-30 top-10 left-0 h-fit w-36 p-6 bg-[#191919] rounded-lg shadow-lg flex flex-col gap-2">
            <div
                onClick={() => setShowPicker(false)}
                className="text-[#ababab] absolute top-2 right-2 text-2xl font-bold transition hover:text-[#ccc]"
            >
                <HiMiniXMark />
            </div>
            <div className="flex flex-col gap-2 mt-0 justify-center items-start">
                <label className="flex flex-row gap-2">
                    <input
                        type="radio"
                        value="Movie"
                        className="text-nowrap w-fit accent-[#E8AF58]"
                        checked={selectedType === "Movie"}
                        onChange={(e) => {
                            const value = e.target.value;
                            setSelectedType(value);
                            setType(value);
                        }}
                    />
                    Movies
                </label>
                <label className="flex flex-row gap-2 text-nowrap">
                    <input
                        type="radio"
                        value="TV Show"
                        className="text-nowrap w-fit accent-[#E8AF58]"
                        checked={selectedType === "TV Show"}
                        onChange={(e) => {
                            const value = e.target.value;
                            setSelectedType(value);
                            setType(value);
                        }}
                    />
                    TV Shows
                </label>
            </div>
        </div>
    );
}