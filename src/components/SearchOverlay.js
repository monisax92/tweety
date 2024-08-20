import React, { useContext, useEffect } from 'react';
import DispatchContext from '../DispatchContext';
import { useImmer } from 'use-immer';
import { Link } from 'react-router-dom';
import Axios from 'axios';
import LoadingAnimation from './LoadingAnimation';
import Post from './Post';

function SearchOverlay() {
	const appDispatch = useContext(DispatchContext);

	const [state, setState] = useImmer({
		searchTerm: '',
		results: [],
		show: 'neither',
		requestCount: 0
	});

	// for search overlay to close on ESC press
	function closeOnEscape(e) {
		if (e.keyCode === 27) handleCloseSearch();
	}

	useEffect(() => {
		document.addEventListener('keyup', closeOnEscape);
		return () => document.removeEventListener('keyup', closeOnEscape);
	}, []);

	//delay sending request to server (so if user types with some decent speed it won't send on each new letter)
	useEffect(() => {
		if (state.searchTerm.trim()) {
			setState(draft => {
				draft.show = 'loading';
			});
			const delay = setTimeout(() => {
				setState(draft => {
					draft.requestCount++;
				});
			}, 500);

			//cleanup function will run not only when component gets unmount but also when this useEffect is called again
			return () => {
				clearTimeout(delay);
			};
		} else {
			setState(draft => {
				draft.show = 'neither';
			});
		}
	}, [state.searchTerm]);

	// actually sending request to server now not on every change of input but on every change on requestCount
	useEffect(() => {
		//do not send on first render
		if (state.requestCount) {
			const request = Axios.CancelToken.source();
			async function fetchPosts() {
				try {
					const response = await Axios.post(
						'/search',
						{ searchTerm: state.searchTerm },
						{ cancelToken: request.token }
					);
					setState(draft => {
						draft.results = response.data;
						draft.show = 'results';
					});
				} catch (e) {
					console.log(
						'Something went wrong while fetching matching posts or the request was cancelled.'
					);
				}
			}
			fetchPosts();
			return () => request.cancel();
		}
	}, [state.requestCount]);

	function handleCloseSearch() {
		appDispatch({ type: 'closeSearch' });
	}

	function handleInput(e) {
		const inp = e.target.value;
		setState(draft => {
			draft.searchTerm = inp;
		});
	}

	return (
		<>
			<div className='search-overlay-top shadow-sm'>
				<div className='container container--narrow'>
					<label htmlFor='live-search-field' className='search-overlay-icon'>
						<i className='fas fa-search'></i>
					</label>
					<input
						autoFocus
						type='text'
						autoComplete='off'
						id='live-search-field'
						className='live-search-field'
						placeholder='What are you interested in?'
						onChange={handleInput}
					/>
					<span onClick={handleCloseSearch} className='close-live-search'>
						<i className='fas fa-times-circle'></i>
					</span>
				</div>
			</div>

			<div className='search-overlay-bottom'>
				<div className='container container--narrow py-3'>
					<div
						className={
							'circle-loader ' +
							(state.show == 'loading' ? 'circle-loader--visible' : '')
						}
					></div>
					<div
						className={
							'live-search-results ' +
							(state.show === 'results' ? 'live-search-results--visible' : '')
						}
					>
						{Boolean(state.results.length) && (
							<div className='list-group shadow-sm'>
								<div className='list-group-item active'>
									<strong>Search Results</strong> ({state.results.length}{' '}
									{state.results.length === 1 ? 'item' : 'items'} found)
								</div>
								{state.results.map(post => {
									return (
										<Post
											post={post}
											onClick={() => appDispatch({ type: 'closeSearch' })}
										/>
									);
								})}
							</div>
						)}
						{!Boolean(state.results.length) && (
							<p className='alert alert-danger text-center shadow-sm'>
								Nothing was found...
							</p>
						)}
					</div>
				</div>
			</div>
		</>
	);
}

export default SearchOverlay;
