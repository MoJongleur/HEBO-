import * as actionTypes from './constTypes'

export function save(data) {
  return {
    type: actionTypes.SET_TO_LOCALSTORE,
    data
  };
}

export function mapRequest() {
  return {
    type: actionTypes.SET_REQUEST_WAIT
  };
}

export function mapRequestSuccess() {
  return {
    type: actionTypes.SET_REQUEST_SUCCESS
  };
}

export function waitRequest() {
  return (dispatch) => {
    try {
      dispatch(mapRequest())
    } catch(err) {
      console.log(err)
    }
  }
}

export function requestSuccess() {
  return (dispatch) => {
    try {
      dispatch(mapRequestSuccess())
    } catch(err) {
      console.log(err)
    }
  }
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