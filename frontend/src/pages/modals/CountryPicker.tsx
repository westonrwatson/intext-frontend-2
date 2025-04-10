import { useEffect, useState } from "react";
import { HiMiniXMark } from "react-icons/hi2";
import { fetchData } from "../../components/fetcher";

export const CountryPicker = ({ type, setType, setShowPicker }: {
    type: string;
    setType: (type: string) => void;
    setShowPicker: (show: boolean) => void;
}) => {
    const [selectedType, setSelectedType] = useState(type);
    const [countries, setCountries] = useState<string[]>([]);

    const getCountries = async () => {
        try {
            const response = await fetchData({
                path: "countries",
                prod: false,
            });

            if (Array.isArray(response)) {
                setCountries(response);
            } else {
                console.error("Unexpected response format:", response);
            }
        } catch (error) {
            console.error("Failed to fetch countries:", error);
        }
    };

    useEffect(() => {
        getCountries();
    }, []);

    return (
        <div className="absolute z-30 top-10 left-0 h-48 w-64 overflow-scroll no-scrollbar p-6 pt-0 bg-[#191919] rounded-lg shadow-lg flex flex-col gap-2">
            <div
                onClick={() => setShowPicker(false)}
                className="text-[#ababab] absolute top-2 right-2 text-2xl font-bold transition hover:text-[#ccc]"
            >
                <HiMiniXMark />
            </div>
            <div className="flex flex-col gap-2 mt-6 justify-center items-start">
                {countries?.map((country) => (
                    <label key={country} className="flex flex-row gap-2">
                        <input
                            type="radio"
                            value={country}
                            className="text-nowrap w-fit accent-[#E8AF58]"
                            checked={selectedType === type}
                            onChange={(e) => {
                                const value = e.target.value;
                                setSelectedType(value);
                                setType(value);
                            }}
                        />
                        {country}
                    </label>
                ))}
            </div>
        </div>
    );
}