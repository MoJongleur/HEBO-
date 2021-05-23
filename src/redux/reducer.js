import * as actionTypes from './constTypes';

function map( state = { history: [] }, action) {
  switch(action.type) {
    case actionTypes.SET_TO_LOCALSTORE:
      return { ...state, history: [action.data, ...state.history.slice(0, 3)] };

    default:
      return state;
  }
}

export default map;