import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { User } from "@/interfaces/user";

type InitialState = {
  value: AuthState;
};

type AuthState = {
  isAuth: boolean;
  user: User | null;
};

const initialState: InitialState = {
  value: {
    isAuth: false,
    user: null,
  } as AuthState,
};

export const auth = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logOut: () => {
      return initialState;
    },
    logIn: (state, action: PayloadAction<User>) => {
      return {
        value: {
          isAuth: true,
          user: action.payload,
        },
      };
    },
    updateUserCheckin: (state: any) => {
      return {
        ...state,
        value: {
          ...state.value,
          user: {
            ...state.value.user,
            is_checkin_today: true,
          },
        },
      };
    },
    updateUserCheckout: (state: any) => {
      return {
        ...state,
        value: {
          ...state.value,
          user: {
            ...state.value.user,
            is_checkout: true,
          },
        },
      };
    },
    completeProfile: (state: any, action: PayloadAction<User>) => {
      return {
        ...state,
        value: {
          ...state.value,
          user: action.payload
        },
      };
    }
  },
});

export const { logIn, logOut, updateUserCheckin, updateUserCheckout, completeProfile } = auth.actions;
export default auth.reducer;
