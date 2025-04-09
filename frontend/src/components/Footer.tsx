import { Link } from "react-router-dom"
import { Logo } from "./logo"
import { useAuthStore } from "../utils/useAuthStore";

export const Footer = () => {
    const isLogginIn = useAuthStore((state) => state.isLoggedIn);
    return (
        <div draggable={false} className="flex flex-col gap-4 justify-center items-center w-full bg-[#383838] text-white text-sm p-4 z-50">
            <Link draggable={false} to="/">
                <Logo />
            </Link>
            <div className="flex flex-row gap-4 justify-center items-center w-full">
                <Link to="/privacy-policy" draggable={false} className="text-white select-none font-extralight hover:text-gray-400 transition">
                    Privacy Policy
                </Link>
                {isLogginIn && (
                    <>
                        <Link to="/tv-shows" draggable={false} className="text-white font-extralight hover:text-gray-400 transition">
                            TV Shows
                        </Link>
                        <Link to="/movies" draggable={false} className="text-white font-extralight hover:text-gray-400 transition">
                            Movies
                        </Link>
                        <Link to="/account" draggable={false} className="text-white font-extralight hover:text-gray-400 transition">
                            Account
                        </Link>
                    </>
                )}
            </div>
            <p draggable={false} className="text-[#D9D9D9] font-extralight select-none">
                © 2025 CineNiche All rights reserved.
            </p>
        </div>
    )
}