import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import createLogger from 'redux-logger';
import api from './middleware/api';
// import rootReducer from './saga/reducers';
// import rootSaga from './saga/sagas';

const sagaMiddleware = createSagaMiddleware();
const loggerMiddleware = createLogger();

const middleware = [sagaMiddleware, api];

if (process.env.NODE_ENV !== 'production') {
  middleware.push(loggerMiddleware);
}

const store = createStore(
  // rootReducer,
  applyMiddleware(...middleware),
);

export default store;
