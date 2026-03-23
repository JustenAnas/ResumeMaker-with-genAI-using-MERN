import { useContext,useEffect } from "react";
import { AuthContext } from "../services/auth.context";
import { login,register,logout,getMe } from "../services/auth.api";


export const useAuth = ()=>{
    const context = useContext(AuthContext)
    const {user,setUser,loading,setLoading} = context

    const  handleLogin = async({email,password})=>{
       setLoading(true)
       try{
        const data = await login({email,password})
       setUser(data.user)
       }
       catch(err){
         console.log(err);
         
       }finally{
        setLoading(false)
       }
      
    }
    const handleRegister = async({email,password,username})=>{
       setLoading(true)
       try {
         const data = await register({email,password,username})
       setUser(data.user)
       } catch (error) {
        console.log(error);
       }finally{
         setLoading(false)
       }
    }
    const handleLogout = async()=>{
        setLoading(true)
        try {
        const data = await  logout()
        setUser(null)
        } catch (error) {
            console.log(error);
        }finally{
            setLoading(false)
        }     
    }
     useEffect(()=>{
        const getAndSetUser = async ()=>{
            try {
            const data = await getMe()
            setUser(data.user)
            } catch (error) {
                
            }finally{
                setLoading(false)
            }
          
            
        }

        getAndSetUser()
        
    },[])
    const handleGetMe = async()=>{
        setLoading(true)
        try {
             const data = await getMe()
        setUser(null)
        } catch (error) {
            console.log(error);
        }finally{
            setLoading(false)
        } 
    }

    return{user,loading,handleLogin,handleRegister,handleLogout,handleGetMe}
}