import React from "react";
import { State, Action, StateProviderProps, ActiveItem } from "../types";

const initState: State = {
  books: {},
  authors: {},
  userInfo: { username: "", id: "" },
  actived: ActiveItem.Home,
};

export const StateContext: React.Context<
  [State, React.Dispatch<Action>]
> = React.createContext<[State, React.Dispatch<Action>]>([
  initState,
  (): State => initState,
]);

export const StateProvider: React.FC<StateProviderProps> = ({
  reducer,
  children,
}: StateProviderProps): JSX.Element => {
  const [state, dispatch] = React.useReducer<React.Reducer<State, Action>>(
    reducer,
    initState
  );

  return (
    <StateContext.Provider value={[state, dispatch]}>
      {children}
    </StateContext.Provider>
  );
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useStateValue = () =>
  React.useContext<[State, React.Dispatch<Action>]>(StateContext);
