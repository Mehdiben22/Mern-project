import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    currentUser : null ,
    error : null ,
    loading : false ,
}  
 
 const userSlice = createSlice({
    name : 'user' ,
    initialState  , 
    reducers:{
    signInStart : (state) => {
        // if we have an error previously we clear that error
        state.loading = true ;
        state.error = null;
    },
    //set the success to action.payload
    signInSuccess : (state,action) => {
        state.currentUser = action.payload;
        state.loading = false ; 
        state.error = null;
    },
    //set the failure to action.payload
    signInFailure : (state,action) => {
        state.loading = false;
        state.error = action.payload;
    },
    updateStart : (state) => {
        state.loading =true ;
        state.error = null;
    },
    //set the success to action.payload
    updateSuccess : (state,action)=> {
        state.currentUser = action.payload  ;
        state.loading = false ; 
        state.error = null ; 
    },
    // set the error to action.payload
    updateFailure : (state,action) => {
        state.loading = false ;
        state.error = action.payload;
    },
    deleteUserStart : (state) => {
        state.loading = true ;
        state.error = null;
    },
    deleteUserSuccess :(state) => {
        state.currentUser = null;
        state.loading = false ; 
        state.error = null ;
    },
    // set error to action payload
    deleteUserFailure : (state,action) => {
        state.loading = false;
        state.error = action.payload;
    },
    signoutSuccess : (state) => {
        state.currentUser = null;
        state.error = null;
        state.loading = false;
    }
  },
});

//Export les const pour les utiliser
export const {signInStart,
              signInSuccess,
              signInFailure, 
              updateStart,
              updateFailure,
              updateSuccess,
              deleteUserStart,
              deleteUserFailure,
              deleteUserSuccess,
              signoutSuccess,
            } = userSlice.actions;

export default userSlice.reducer; 