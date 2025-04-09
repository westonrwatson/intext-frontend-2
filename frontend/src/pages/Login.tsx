import { useState } from "react";
import { supabase } from "../utils/supabase";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../utils/useAuthStore";

const API_KEY = import.meta.env.VITE_API_KEY

export const Login = () => {
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const navigate = useNavigate()
    const setLogin = useAuthStore((state) => state.setLoggedIn);
    const setAdmin = useAuthStore((state) => state.setAdmin);

    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return re.test(email)
    };

    const validatePassword = (password: string) => {
        return password.length >= 8
    };

    const validateLogin = async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        })

        if (data.user) {
            // Check database

            const response = await fetch('https://cineniche-api-afcbcqf8fmcbace6.eastus-01.azurewebsites.net/check-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': API_KEY,
                },
                body: JSON.stringify({ email: data.session.user.email })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const responseData = await response.json();
            console.log('Response from API:', responseData);

            console.log(responseData)

            if (responseData.exists) {
                if (responseData.admin === true) {
                    setAdmin(true)
                } else {
                    setAdmin(false)
                }
                setLogin(true)
                navigate('/')
            };
        };
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        if (!email || !password) {
            setErrorMessage('Please fill in all fields')
            return
        };

        if (!validateEmail(email)) {
            setErrorMessage('Invalid email format')
            return
        };

        if (!validatePassword(password)) {
            setErrorMessage('Password must be at least 8 characters long')
            return
        };

        // Perform login logic here
        validateLogin(email, password)
    };

    return (
        <div className="flex items-center justify-center h-full bg-[#191919] px-4">
            <div className="bg-[#383838] rounded-lg p-10 w-full max-w-3xl shadow-md text-center">
                <h1 className="text-white text-5xl font-bold mt-8 mb-12">Welcome back!</h1>

                <form className="space-y-4">
                    <div className="flex flex-col justify-center items-center gap-4">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => {
                                setErrorMessage(null)
                                setEmail(e.target.value)
                            }}
                            className="max-w-[400px] w-full px-4 py-3 rounded-full bg-gray-300 text-black placeholder:text-gray-600 outline-none"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => {
                                setErrorMessage(null)
                                setPassword(e.target.value)
                            }}
                            className="max-w-[400px] w-full px-4 py-3 rounded-full bg-gray-300 text-black placeholder:text-gray-600 outline-none"
                        />

                        {errorMessage && (
                            <p className="text-red-500 text-sm mt-2">
                                {errorMessage}
                            </p>
                        )}
                    </div>

                    <p className="text-sm text-gray-300">
                        Don’t have an account? <a href="/sign-up" className="text-[#EA8C55] font-semibold cursor-pointer">Sign Up</a>
                    </p>

                    <button
                        type="submit"
                        onClick={handleSubmit}
                        className="text-2xl px-8 mt-2 py-2 bg-[#EA8C55] hover:bg-[#8C5433] text-white font-semibold rounded-full transition cursor-pointer"
                    >
                        Login
                    </button>
                </form>

                <div className="mt-8">
                    <a href="/privacy-policy" className="text-sm transition text-gray-300 underline hover:text-white">
                        Privacy Policy
                    </a>
                </div>
            </div>
        </div>
    )
}