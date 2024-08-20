import React, { useContext, useEffect } from 'react';
import Axios from 'axios';
import Page from './Page';
import StateContext from '../StateContext';
import { useImmer } from 'use-immer';
import LoadingAnimation from './LoadingAnimation';
import Post from './Post';

function HomeUser() {
	const appState = useContext(StateContext);
	const [state, setState] = useImmer({
		isLoading: true,
		feed: []
	});

	useEffect(() => {
		const axiosRequest = Axios.CancelToken.source();

		async function fetchData() {
			try {
				const res = await Axios.post('/getHomeFeed', {
					token: appState.user.token
				});
				setState(draft => {
					draft.isLoading = false;
					draft.feed = res.data;
				});
			} catch (err) {
				console.log(err);
			}
		}
		fetchData();

		//clean-up function
		return () => {
			axiosRequest.cancel();
		};
	}, []);

	if (state.isLoading) {
		return <LoadingAnimation />;
	}

	return (
		<Page title='Your Feed'>
			{state.feed.length > 0 && (
				<>
					<h2 className='text-center'>The latest posts from who you follow.</h2>
					<div className='list-group'>
						{console.log(state.feed)}
						{state.feed.map(post => {
							return <Post post={post} />;
						})}
					</div>
				</>
			)}
			{state.feed.length === 0 && (
				<>
					<h2 className='text-center'>
						Hello <strong>{appState.user.username}</strong>, your feed is empty.
					</h2>
					<p className='lead text-muted text-center'>
						Your feed displays the latest posts from the people you follow. If
						you don&rsquo;t have any friends to follow that&rsquo;s okay; you
						can use the &ldquo;Search&rdquo; feature in the top menu bar to find
						content written by people with similar interests and then follow
						them.
					</p>
				</>
			)}
		</Page>
	);
}

export default HomeUser;
