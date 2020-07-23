import React, { createContext, useContext, useReducer } from 'react';
import { State, Action, StateProviderProps } from '../types';

const initState: State = {
    books: { }
};

export const StateContext = createContext<[State, React.Dispatch<Action>]>([
    initState,
    () => initState
]);

export const StateProvider: React.FC<StateProviderProps> = ({ reducer, children }: StateProviderProps) => {
    const [ state, dispatch ] = useReducer(reducer, initState);

    return (
        <StateContext.Provider value={ [ state, dispatch ] }>
            { children }
        </StateContext.Provider>
    );
};

export const useStateValue = () => useContext(StateContext);