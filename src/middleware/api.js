import fetch from 'isomorphic-fetch';

export const CALL_API = 'CALL API';

const callApi = (endpoint, requestOptions) => (
  fetch(`http://localhost:3003/${endpoint}`, requestOptions)
    .then(response => response.json()
      .then((json) => {
        if (!response.ok) {
          return Promise.reject(json);
        }
        return json;
      }))
);

/* eslint-disable consistent-return */
export default store => next => (action) => {
  const callAPI = action[CALL_API];
  if (typeof callAPI === 'undefined') {
    return next(action);
  }
  const { types, requestOptions = {} } = callAPI;
  let { endpoint } = callAPI;
  if (typeof endpoint === 'function') {
    endpoint = endpoint(store.getState());
  }
  if (typeof endpoint !== 'string') {
    throw new Error('Specify a string endpoint URL.');
  }
  if (!Array.isArray(types) || types.length !== 3) {
    throw new Error('Expected an array of three action types.');
  }
  if (!types.every(type => typeof type === 'string')) {
    throw Error('Expected action types to be strings.');
  }

  const [requestType, successType, failureType] = types;

  next({ type: requestType });

  return callApi(endpoint, requestOptions)
    .then((response) => {
      next({ type: successType, response });
      return Promise.resolve(response);
    })
    .catch((error) => {
      let errors = null;
      if (error.errors && Array.isArray(error.errors)) {
        errors = error.errors.reduce((obj, currObj) => {
          obj[currObj.path] = currObj.message;
          return obj;
        }, {});
      }
      const err = errors || error.message || error || 'Something bad happened.';
      next({
        type: failureType,
        error: err,
      });
      return Promise.reject(err);
    });
};
