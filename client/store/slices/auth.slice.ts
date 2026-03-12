import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, IUser } from '@/types/user.type';

const STORAGE_KEY = 'auth';

const getInitialState = (): AuthState => {
  if (typeof window === 'undefined') return { user: null, isAuthenticated: false };

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : { user: null, isAuthenticated: false };
  } catch {
    return { user: null, isAuthenticated: false };
  }
};

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    loginSuccess: (state, action: PayloadAction<IUser>) => {
      state.isAuthenticated = true;
      state.user = action.payload;

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          user: action.payload,
          isAuthenticated: true,
        })
      );
    },

    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem(STORAGE_KEY);
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;