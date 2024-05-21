import { createStore, combineReducers, applyMiddleware } from "redux";
import { createLogger } from "redux-logger";
import thunkMiddleware from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import auth from "./auth";
import songs from "./songs";
import queue from "./queue";
import voteError from "./vote";
import roomdetail from "./room";
import playlists from './playlists';
import page from './page'
import customSong from './customsong'

const reducer = combineReducers({ auth, songs, queue, voteError, roomdetail, playlists, page, customSong});
const middleware = composeWithDevTools(
  applyMiddleware(thunkMiddleware, createLogger({ collapsed: true }))
);
const store = createStore(reducer, middleware);
export default store;
export * from "./auth";
export * from "./songs";
export * from "./queue";
export * from "./vote";
export * from "./room";
export * from './playlists';
export * from './page';
export * from './customsong';
