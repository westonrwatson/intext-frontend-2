import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../utils/supabase'
import { postData } from '../components/fetcher'

export default function Callback() {
    const navigate = useNavigate()

    useEffect(() => {
        const completeSignIn = async () => {
            const { data, error } = await supabase.auth.getSession()

            if (data.session) {
                console.log('✅ Logged in user:', data.session.user)

                const dbResponse = await postData({
                    path: 'auth',
                    body: {
                        access_token: data.session.access_token,
                        refresh_token: data.session.refresh_token,
                        user_id: data.session.user.id,
                        email: data.session.user.email,
                        first_name: data.session.user.user_metadata.first_name,
                        last_name: data.session.user.user_metadata.last_name,
                    },
                    prod: true
                })

                console.log(dbResponse)

                // maybe show toast, save user, etc
                // navigate('/')
            } else {
                console.error('⚠️ Error during session:', error)
                navigate('/login')
            }
        }

        completeSignIn()
    }, [])

    return <div className="text-white h-full flex justify-center items-center p-10">Signing you in...</div>
}