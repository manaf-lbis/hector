import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, IUser } from '../../types/user.type'

const initialState: AuthState = {
    user: null,
    isAuthenticated: false
}


export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        successfullLogin: (state, action: PayloadAction<IUser>) => {
            state.isAuthenticated = true;
            state.user = action.payload
        },

        userLogout: (state) => {
            state.isAuthenticated = false;
            state.user = null
        }
    }


})


export const { userLogout, successfullLogin } = userSlice.actions
export default userSlice.reducer;