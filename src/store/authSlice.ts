import { createSlice } from '@reduxjs/toolkit'
export interface AuthState {
    isAutenticated: boolean,
    userName: string,
    userRol: string
}

const initialAuthState: AuthState = {
    isAutenticated: false,
    userName: '',
    userRol: ''
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
        },

        logout: () => {
            return initialAuthState;
        }
    }
})

export const authActions = authSlice.actions

export default authSlice.reducer