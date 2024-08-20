import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React, { useEffect, useReducer, useState, Suspense } from 'react';
import Axios from 'axios';
import { CSSTransition } from 'react-transition-group';
import { useImmerReducer } from 'use-immer'; //could be useImmerState if we were using useState and not useReducer

import StateContext from './StateContext';
import DispatchContext from './DispatchContext';

import LoadingAnimation from './components/LoadingAnimation';
import Header from './components/Header';
import HomeGuest from './components/HomeGuest';
import HomeUser from './components/HomeUser';
import About from './components/About';
import Terms from './components/Terms';
import Footer from './components/Footer';
import FlashMessages from './components/FlashMessages';
import ProfileScreen from './components/ProfileScreen';
import EditPostScreen from './components/EditPostScreen';
import PageNotFound from './components/PageNotFound';
const ChatBox = React.lazy(() => import('./components/ChatBox'));
const SearchOverlay = React.lazy(() => import('./components/SearchOverlay'));
const CreatePostScreen = React.lazy(() => import("./components/CreatePostScreen"));
const SinglePostScreen = React.lazy(() => import("./components/SinglePostScreen"));

Axios.defaults.baseURL = process.env.BACKENDURL || "https://tweety-backend-1o5v.onrender.com"
function App() {
	const initialState = {
		loggedIn: Boolean(localStorage.getItem('TweetyToken')),
		flashMessages: [],
		user: {
			token: localStorage.getItem('TweetyToken'),
			username: localStorage.getItem('TweetyUsername'),
			avatar: localStorage.getItem('TweetyAvatar')
		},
		isSearchOpen: false,
		isChatOpen: false,
		unreadMsgsCount: 0
	};

	function appReducer(draft, action) {
		//without immer we have state not draft
		switch (action.type) {
			case 'login':
				draft.loggedIn = true;
				draft.user = action.data;
				break;
			case 'logout':
				draft.loggedIn = false;
				break;
			case 'flashMessage':
				draft.flashMessages.push(action.value);
				break;
			case 'openSearch':
				draft.isSearchOpen = true;
				break;
			case 'closeSearch':
				draft.isSearchOpen = false;
				break;
			case 'toggleChat':
				draft.isChatOpen = !draft.isChatOpen;
				break;
			case 'closeChat':
				draft.isChatOpen = false;
				break;
			case 'addUnreadMsg':
				draft.unreadMsgsCount++;
				break;
			case 'clearUnreadMsgs':
				draft.unreadMsgsCount = 0;
				break;
		}
	}

	const [state, dispatch] = useImmerReducer(appReducer, initialState);

	useEffect(() => {
		if (state.loggedIn) {
			localStorage.setItem('TweetyToken', state.user.token);
			localStorage.setItem('TweetyUsername', state.user.username);
			localStorage.setItem('TweetyAvatar', state.user.avatar);
		} else {
			localStorage.removeItem('TweetyToken');
			localStorage.removeItem('TweetyUsername');
			localStorage.removeItem('TweetyAvatar');
		}
	}, [state.loggedIn]);

	//check token on render
	useEffect(() => {
		//do not send on first render
		if (state.loggedIn) {
			const request = Axios.CancelToken.source();
			async function isTokenValid() {
				try {
					const response = await Axios.post(
						'/checkToken',
						{ token: state.user.token },
						{ cancelToken: request.token }
					);
					if (!response.data) {
						dispatch({type: "logout"});
						dispatch({type: "flashMessage", value: "Your token has expired. Please log in again."})
					}
				} catch (e) {
					console.log(
						'Something went wrong while fetching matching posts or the request was cancelled.'
					);
				}
			}
			isTokenValid();
			return () => request.cancel();
		}
	}, [state.requestCount]);

	return (
		<StateContext.Provider value={state}>
			<DispatchContext.Provider value={dispatch}>
				<BrowserRouter>
					<FlashMessages />
					<Header />
					<Suspense fallback={<LoadingAnimation/>}>
					<Routes>
						<Route
							path='/'
							element={state.loggedIn ? <HomeUser /> : <HomeGuest />}
						/>
						<Route path='/profile/:username/*' element={<ProfileScreen />} />
						<Route path='/post/:postId' element={<SinglePostScreen />} />
						<Route path='/post/:postId/edit' element={<EditPostScreen />} />
						<Route path='/about-us' element={<About />} />
						<Route path='/terms' element={<Terms />} />
						<Route path='/create-post' element={<CreatePostScreen />} />
						<Route path='/*' element={<PageNotFound />} />
					</Routes>
					</Suspense>
					<CSSTransition
						timeout={330}
						in={state.isSearchOpen}
						classNames='search-overlay'
						unmountOnExit
					>
						<div className="search-overlay">
							<Suspense fallback="">
								<SearchOverlay />
							</Suspense>
						</div>
					</CSSTransition>
					<Suspense fallback="">
						{state.loggedIn && <ChatBox />}
					</Suspense>
					<Footer />
				</BrowserRouter>
			</DispatchContext.Provider>
		</StateContext.Provider>
	);
}

export default App;
