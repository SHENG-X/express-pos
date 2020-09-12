import React, {
  useReducer,
  createContext
} from 'react';

export default (reducer, actions, initialState, stateAlias) => {
  const Context = createContext(initialState);

  const Provider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const boundActions = {};
    for (let key in actions) {
      boundActions[key] = actions[key](dispatch);
    }

    let providerValue = { ...boundActions };
    if (stateAlias) {
      providerValue[stateAlias] = state;
    } else {
      providerValue = { state, ...boundActions };
    }

    return(
      <Context.Provider value={providerValue}>
        { children }
      </Context.Provider>
    )
  }

  return { Context, Provider }
}
