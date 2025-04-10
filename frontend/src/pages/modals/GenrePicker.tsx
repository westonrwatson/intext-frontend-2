import { useState } from "react";
import { HiMiniXMark } from "react-icons/hi2";
import { genres } from "../../utils/genres";

export const GenrePicker = ({ type, setType, setShowPicker }: {
    type: string;
    setType: (type: string) => void;
    setShowPicker: (show: boolean) => void;
}) => {
    const [selectedType, setSelectedType] = useState(type);

    return (
        <div className="absolute z-30 top-10 left-0 h-48 w-64 overflow-scroll no-scrollbar p-6 pt-0 bg-[#191919] rounded-lg shadow-lg flex flex-col gap-2">
            <div
                onClick={() => setShowPicker(false)}
                className="text-[#ababab] absolute top-2 right-2 text-2xl font-bold transition hover:text-[#ccc]"
            >
                <HiMiniXMark />
            </div>
            <div className="flex flex-col gap-2 mt-6 justify-center items-start">
                {genres.map((genre) => (
                    <label key={genre} className="flex flex-row gap-2">
                        <input
                            type="radio"
                            value={genre}
                            className="text-nowrap w-fit accent-[#E8AF58]"
                            checked={selectedType === genre}
                            onChange={(e) => {
                                const value = e.target.value;
                                setSelectedType(value);
                                setType(value);
                            }}
                        />
                        {genre}
                    </label>
                ))}
            </div>
        </div>
    );
}