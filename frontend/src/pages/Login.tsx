import { useState } from "react";
import { supabase } from "../utils/supabase";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../utils/useAuthStore";

const API_KEY = import.meta.env.VITE_API_KEY;

export const Login = () => {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const navigate = useNavigate();

    const setLogin = useAuthStore((state) => state.setLoggedIn);
    const setAdmin = useAuthStore((state) => state.setAdmin);
    const setUser = useAuthStore((state) => state.setUser); 
    const login = async () => {
        const res = await fetch('/check-user', { /* your auth call */ });
        const data = await res.json();
        console.log('✅ Backend response:', data);

      
        useAuthStore.getState().setUser({
          user_id: data.user_id,
          name: data.name,
          email: data.email,
        });
      
        useAuthStore.getState().setLoggedIn(true);
        useAuthStore.getState().setAdmin(data.admin); // if needed
      };// ✅ for user info

    const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const validatePassword = (password: string) => password.length >= 8;

    const validateLogin = async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        })

        if (error) {
            setErrorMessage("Invalid email or password");
            return;
        }
        
        if (data.user) {
            // Check database

            const jwt = data.session?.access_token
            if (jwt) localStorage.setItem('jwt', jwt)

        }
        if (!data.user) {
            setErrorMessage("Unable to log in.");
            return;
        }

        try {
            const response = await fetch('https://intex-backend-2-fre9fjaxgfevfvee.centralus-01.azurewebsites.net/check-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': API_KEY,
                },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                throw new Error("Failed to contact backend.");
            }

            const responseData = await response.json();
            console.log('✅ Backend response:', responseData);

            if (responseData.exists) {
                setUser(responseData.user);

                setLogin(true);
                if (responseData.admin) {
                    setAdmin(true);
                    navigate('/admin');
                } else {
                    navigate('/');
                }
            } else {
                setErrorMessage("User does not exist in the database.");
            }
        } catch (err) {
            console.error("Backend check failed:", err);
            setErrorMessage("An error occurred while logging in.");
        }
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        if (!email || !password) {
            setErrorMessage("Please fill in all fields");
            return;
        }
        if (!validateEmail(email)) {
            setErrorMessage("Invalid email format");
            return;
        }
        if (!validatePassword(password)) {
            setErrorMessage("Password must be at least 12 characters long");
            return;
        }

        validateLogin(email, password);
    };

    const handleGoogleSignIn = async () => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: 'https://intex-backend-2-fre9fjaxgfevfvee.centralus-01.azurewebsites.net/callback'
            }
        });

        if (error) {
            console.error('Google sign-in error:', error.message)
            setErrorMessage('Failed to sign in with Google.')
        }
    };

    return (
        <div className="flex items-center justify-center h-full bg-[#191919] px-4">
            <div className="bg-[#383838] rounded-lg p-10 w-full max-w-3xl shadow-md text-center">
                <h1 className="text-white text-5xl font-bold mt-8 mb-12">Welcome back!</h1>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="flex flex-col justify-center items-center gap-4">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => {
                                setErrorMessage(null);
                                setEmail(e.target.value);
                            }}
                            className="max-w-[400px] w-full px-7 py-3 rounded-full bg-gray-300 text-black placeholder:text-gray-600 outline-none"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => {
                                setErrorMessage(null);
                                setPassword(e.target.value);
                            }}
                            className="max-w-[400px] w-full px-7 py-3 rounded-full bg-gray-300 text-black placeholder:text-gray-600 outline-none"
                        />
                        {errorMessage && (
                                <p className="bg-[#2e2e2e] border border-[#EA8C55] text-gray-100 text-xs mt-1 py-2 px-4 rounded-lg">
                                {errorMessage}
                            </p>
                            )}
                    </div>

                    <p className="text-sm text-gray-300 font-regular">
                        Don’t have an account? <a href="/sign-up" className="text-[#EA8C55] font-bold cursor-pointer">Sign Up</a>
                    </p>
                    <div className="flex flex-row justify-center items-center">
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            className="text-2xl px-8 mt-2 py-2 bg-[#EA8C55] hover:bg-[#8C5433] text-white font-semibold rounded-full transition cursor-pointer"
                        >
                            Login
                        </button>
                        <p className="text-white px-3">
                            Or
                        </p>
                        <div
                            onClick={handleGoogleSignIn}
                            draggable={false}
                            className="flex items-center gap-2 px-2 py-2 bg-white text-black font-semibold cursor-pointer rounded-full shadow hover:bg-gray-200 transition select-none"
                        >
                            <img draggable={false} src="https://img.icons8.com/color/24/000000/google-logo.png" alt="Google" />
                        </div>
                    </div>
                </form>

                <div className="mt-8">
                    <a href="/privacy-policy" className="text-sm transition text-gray-300 underline hover:text-white">
                        Privacy Policy
                    </a>
                </div>
            </div>
        </div>
    );
};
