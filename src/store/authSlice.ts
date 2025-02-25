import { createSlice } from '@reduxjs/toolkit'
export interface AuthState {
    isAutenticated: boolean,
    userName: string,
    userRol: string,
    userAvatar: string
}

const initialAuthState: AuthState = {
    isAutenticated: false,
    userName: '',
    userRol: '',
    userAvatar: ''
}

const authSlice = createSlice({
    name: 'authentication',
    initialState: initialAuthState,
    reducers: {

        login: (state, action) => {
            const userData = action.payload
            state.isAutenticated = true
            state.userName = userData.name
            state.userRol = userData.rol
            state.userAvatar = userData.avatar
        },

        logout: () => {
            return initialAuthState;
        }
    }
})

export const authActions = authSlice.actions

export default authSlice.reducer