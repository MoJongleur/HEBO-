import * as actionTypes from './constTypes';

function map( state = { history: [], wait: false }, action) {
  switch(action.type) {
    case actionTypes.SET_TO_LOCALSTORE:
      return { ...state, history: [action.data, ...state.history.slice(0, 3)] };

    case actionTypes.SET_REQUEST_WAIT:
      return { ...state, wait:true };

    case actionTypes.SET_REQUEST_SUCCESS:
      return { ...state, wait:false };

    default:
      return state;
  }
}

export default map;