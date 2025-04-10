import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../utils/supabase'
import { useAuthStore } from '../utils/useAuthStore'
import { toast } from 'sonner'

const API_KEY = import.meta.env.VITE_API_KEY

export default function Callback() {
    const navigate = useNavigate()
    const setLogin = useAuthStore((state) => state.setLoggedIn);
    const setAdmin = useAuthStore((state) => state.setAdmin);

    const completeSignIn = async () => {
        const { data, error } = await supabase.auth.getSession()

        if (data.session) {
            console.log('✅ Logged in user')

            const jwt = data.session.access_token
            localStorage.setItem('jwt', jwt)

            let name = "";
            if (!data.session.user.user_metadata.first_name || !data.session.user.user_metadata.last_name) {
                name = data.session.user.user_metadata.full_name;
            } else {
                name = `${data.session.user.user_metadata.first_name} ${data.session.user.user_metadata.last_name}`;
            };

            const response = await fetch('https://cineniche-api-afcbcqf8fmcbace6.eastus-01.azurewebsites.net/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': API_KEY,
                },
                body: JSON.stringify({
                    email: data.session.user.email,
                    name: name,
                })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const responseData = await response.json();
            console.log('Response from API:', responseData);

            if (responseData.authenticated) {
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

            toast.success('Successfully logged in!')
        } else {
            console.error('⚠️ Error during session:', error)
            navigate('/login')
        }
    }
    useEffect(() => {
        completeSignIn()
    }, [])

    return <div className="text-white h-full flex justify-center items-center p-10">Signing you in...</div>
}