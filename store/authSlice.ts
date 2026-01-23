import { create } from "zustand";
import { persist, combine, PersistOptions } from "zustand/middleware";
import {
  createSelectorHooks,
  ZustandHookSelectors,
  createSelectorFunctions,
  ZustandFuncSelectors
} from "auto-zustand-selectors-hook";




type InitialState = {
  user: User | null;
  email: string;
  password: string;
  token: string | null;
  refresh: string | null;
  authorities: string[];
};

type Actions = {
  setReset: () => void;
  setUser: (user: InitialState["user"]) => void;
  setEmail: (user: InitialState["email"]) => void;
  setPassword: (user: InitialState["password"]) => void;
  setToken: (user: InitialState["token"]) => void;
  setRefreshToken: (user: InitialState["refresh"]) => void;
  setAuthorities: (user: InitialState["authorities"]) => void;

};

const initialState: InitialState = {
  user: null,
  email: "",
  password: "",
  token: null,
  refresh: null,
  authorities: [],
};

const reducer = combine(initialState, (set) => ({
  setUser: (user: InitialState["user"]) => set({ user }),
  setEmail: (email: InitialState["email"]) => set({ email }),
  setPassword: (password: InitialState["password"]) => set({ password }),
  setToken: (token: InitialState["token"]) => set({ token }),
  setRefreshToken: (refresh: InitialState["refresh"]) => set({ refresh }),
  setAuthorities: (authorities: InitialState["authorities"]) => {
    set({ authorities });
  },
  setReset: () => {
    set(initialState)
  }
}));

// const logger = (config) => (set, get, api) => {
//   return config(
//     (args) => {
//       // console.log("studio  applying", args);
//       set(args);
//       // console.log("studio  new state", get());
//     },
//     get,
//     api
//   );
// };

type Selectors = InitialState & Actions;

const persistConfig: PersistOptions<Selectors> = {
  name: "auth"
}

export const baseReducer = create(persist(reducer, persistConfig));


export const {
  useUser,
  useEmail,
  usePassword,
  useSetPassword,
  useSetUser,
  useSetEmail,
  useToken,
  useRefresh,
  useSetToken,
  useAuthorities,
  useSetReset,
  useSetRefreshToken,
  useSetAuthorities,

} = createSelectorHooks(baseReducer) as typeof baseReducer &
ZustandHookSelectors<Selectors>;

export const authSlice = createSelectorFunctions(baseReducer) as typeof baseReducer & ZustandFuncSelectors<Selectors>;
