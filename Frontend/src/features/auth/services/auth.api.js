import axios from "axios"

const api = axios.create({
    baseURL:import.meta.env.VITE_API_URL,
    withCredentials:true
})


export async function register({username,email,password}) {
    try {
        const response = await api.post('/api/auth/register', {
            username,
            email,
            password
        })
        return response.data
    } catch (error) {
        const message = error.response?.data?.message || "Registration failed"
        throw new Error(message)
    }
}

export async function login({email,password}){

    try {
         const response = await api.post('/api/auth/login',{
        email,password
    })

     return response.data

    } catch (error) {
        console.log(error);
        
    }
   

}

export async function logout(){

    try {
        const response = await api.get('/api/auth/logout')
        return response.data
    } catch (error) {
        console.log(error);
        
    }

}

export async function getMe() {
    try {
        const response = await api.get('/api/auth/get-me')
        return { success: true, data: response.data }
    } catch (error) {
        console.log("GET ME FAILED:", error.response?.data || error.message);
        return { success: false, data: null };
    }
}

