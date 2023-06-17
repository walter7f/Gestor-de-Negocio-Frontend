import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


export const logInAsync = createAsyncThunk(
    'auth/logInAsync',
    async(dataUser)=>{
        try {
            const User = await axios({
                url: ' http://localhost:3800/api/admin/sign-in',
                method: 'POST',
                data: dataUser
            });
            console.log(User);
            localStorage.setItem('app_token', User.data.token)
            localStorage.setItem('idUser', User.data.idUser)

            return {
                token:User.data.token, 
                idUser:User.data.idUser, 
                isAuth:true}

        } catch (error) {
            console.log(error);
            localStorage.removeItem('app_token')
            return{token:'', idUser:'', isAuth:false}
            
        }
    }
);


const token = localStorage.getItem("app_token")

const idUser = localStorage.getItem("idUser")

const initialState={
    isAuth: token? true:false,
    token: token? token: null,
    idUser: idUser ? idUser:'',
};

export const authSlice = createSlice({
    name:'auth',
    initialState:initialState,
    reducers:{
            LogOut:(state)=>{
            state.isAuth= false;
            if (state.isAuth === false){
                localStorage.removeItem("app_token")
                localStorage.removeItem("idUser")
            }

        }
    },
    extraReducers:{
       [logInAsync.pending]:(state)=>{
            state.isAuth=true;
        },

        [logInAsync.fulfilled]:(state, action)=>{
            const{token, idUser,isAuth}= action.payload;
                state.isAuth= isAuth;
                state.token= token;
                state.idUser=idUser;

        },
        [logInAsync.rejected]:(state)=>{
            state.isAuth= false;
            state.idUser= '';
            state.token = '';
        }
    }
})
 export const{LogOut}= authSlice.actions;
export default authSlice.reducer;