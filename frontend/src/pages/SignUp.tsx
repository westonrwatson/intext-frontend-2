import { useState } from "react";
import { supabase } from "../utils/supabase";

export const SignUp = () => {
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [firstName, setFirstName] = useState<string>("")
    const [lastName, setLastName] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [goConfirm, setGoConfirm] = useState<boolean>(false)

    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return re.test(email)
    };

    const validatePassword = (password: string) => {
        return password.length >= 8
    };

    const handleGoogleSignIn = async () => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: 'https://zealous-water-0b3cb241e.6.azurestaticapps.net/callback'
            }
        });

        if (error) {
            console.error('Google sign-in error:', error.message)
            setErrorMessage('Failed to sign in with Google.')
        }
    };

    const validateSignUp = async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    first_name: firstName,
                    last_name: lastName
                },
                emailRedirectTo: 'https://zealous-water-0b3cb241e.6.azurestaticapps.net/callback'
            }
        })

        console.log(data, error)

        const token = (await supabase.auth.getSession()).data.session?.access_token

        console.log(token)

        if (token) {
            setGoConfirm(true)
            return;
        }
    };

    const handleSubmit = ({
        email,
        password,
        firstName,
        lastName
    }: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
    }) => {
        if (!email || !password || !firstName || !lastName) {
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
        validateSignUp(email, password)
    };

    return (
        <div className="flex items-center justify-center w-full h-full bg-[#191919] px-4">
            <div className="bg-[#383838] rounded-lg p-10 w-full max-w-3xl shadow-md text-center">
                {goConfirm ? (
                    <div className="text-white text-2xl mb-4">
                        Check your email to confirm your account!
                    </div>
                ) : (
                    <>
                        <h1 className="text-white text-5xl font-bold mt-8 mb-12">Let's Get You <br /> Set Up!</h1>

                        <div className="space-y-4 flex flex-col justify-center items-center w-full">
                            <div className="flex flex-col w-full justify-center items-center gap-4">
                                <input
                                    type="text"
                                    placeholder="First Name"
                                    value={firstName}
                                    onChange={(e) => {
                                        setErrorMessage(null)
                                        setFirstName(e.target.value)
                                    }}
                                    className="max-w-[400px] w-full px-4 py-3 rounded-full bg-gray-300 text-black placeholder:text-gray-600 outline-none"
                                />
                                <input
                                    type="text"
                                    placeholder="Last Name"
                                    value={lastName}
                                    onChange={(e) => {
                                        setErrorMessage(null)
                                        setLastName(e.target.value)
                                    }}
                                    className="max-w-[400px] w-full px-4 py-3 rounded-full bg-gray-300 text-black placeholder:text-gray-600 outline-none"
                                />
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
                                Already have an account? <a href="/login" className="text-[#EA8C55] font-semibold cursor-pointer">Login</a>
                            </p>
                            <div className="flex flex-row justify-center items-center">
                                <div
                                    onClick={() => handleSubmit({
                                        email,
                                        password,
                                        firstName,
                                        lastName
                                    })}
                                    className="px-8 w-fit text-2xl py-2 bg-[#EA8C55] hover:bg-[#8C5433] text-white font-semibold rounded-full transition cursor-pointer"
                                >
                                    Sign Up
                                </div>
                                <p className="text-white px-3">
                                    Or
                                </p>
                                <div
                                    onClick={handleGoogleSignIn}
                                    className="flex items-center gap-2 px-2 py-2 bg-white text-black font-semibold rounded-full shadow hover:bg-gray-200 transition"
                                >
                                    <img src="https://img.icons8.com/color/24/000000/google-logo.png" alt="Google" />
                                </div>
                            </div>
                        </div>

                        <div className="mt-8">
                            <a href="/privacy-policy" className="text-sm transition text-gray-300 underline hover:text-white">
                                Privacy Policy
                            </a>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}