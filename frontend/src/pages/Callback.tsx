import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../utils/supabase'
import { useAuthStore } from '../utils/useAuthStore'
import { toast } from 'sonner'

const IS_PROD = import.meta.env.MODE === 'production';

export default function Callback() {
    const navigate = useNavigate()
    const setLogin = useAuthStore((state) => state.setLoggedIn);
    const setAdmin = useAuthStore((state) => state.setAdmin);
    const setUser = useAuthStore((state) => state.setUser);

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

            const url = `${IS_PROD ? 'https://cineniche-api-afcbcqf8fmcbace6.eastus-01.azurewebsites.net/' : 'http://localhost:5016/'}`;

            const response = await fetch(`${url}auth`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: data.session.user.email,
                    name: name,
                })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            if (response) {
                const response = await fetch(`${url}check-user`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: data.session.user.email })
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const responseData = await response.json();

                if (responseData.exists) {
                    setLogin(true)
                    setUser({
                        user_id: responseData.user_id,
                        name: responseData.name,
                        email: data.session.user.email || ''
                    })
                    if (responseData.admin === true) {
                        setAdmin(true)
                        navigate('/admin')
                    } else {
                        setAdmin(false)
                        navigate('/')
                    }
                } else {
                    console.log('User does not exist in the database')
                    toast.error('User does not exist in the database')
                    navigate('/login')
                }
            } else {
                console.log('User does not exist in the database')
                toast.error('User does not exist in the database')
                navigate('/login')
            }

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