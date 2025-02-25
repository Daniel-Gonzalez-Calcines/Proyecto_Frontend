import { createSlice } from '@reduxjs/toolkit';

export interface AuthState {
    isAutenticated: boolean,
    userName: string,
    userRol: string,
    userAvatar: string
}

const getInitialAuthState = (): AuthState => {
    const savedState = localStorage.getItem('authState');
    if (savedState) {
        return JSON.parse(savedState);
    }
    return {
        isAutenticated: false,
        userName: '',
        userRol: '',
        userAvatar: ''
    };
};

const initialAuthState: AuthState = getInitialAuthState();

const authSlice = createSlice({
    name: 'authentication',
    initialState: initialAuthState,
    reducers: {
        login: (state, action) => {
            const userData = action.payload;
            state.isAutenticated = true;
            state.userName = userData.name;
            state.userRol = userData.rol;
            state.userAvatar = userData.avatar;

            localStorage.setItem('authState', JSON.stringify(state));
        },

        logout: () => {
            localStorage.removeItem('authState');
            return initialAuthState;
        }
    }
});

export const authActions = authSlice.actions;

export default authSlice.reducer;