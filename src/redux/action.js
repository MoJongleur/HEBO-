import * as actionTypes from './constTypes'

export function save(data) {
  return {
    type: actionTypes.SET_TO_LOCALSTORE,
    data
  };
}

export function saveRequest(data) {
  return (dispatch) => {
    try {
      dispatch(save(data))
    } catch(err) {
      console.log('*Свист неудачи*')
    }
  }
}