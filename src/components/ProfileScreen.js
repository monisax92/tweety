import React, { useEffect, useContext, useState } from 'react';
import Page from './Page';
import { useParams, NavLink, Routes, Route } from 'react-router-dom';
import Axios from 'axios';
import StateContext from '../StateContext';
import ProfilePosts from './ProfilePosts';
import { useImmer } from 'use-immer';
import ProfileFollowers from './ProfileFollowers';
import ProfileFollowing from './ProfileFollowing';

function ProfileScreen() {
	const { username } = useParams();
	const appState = useContext(StateContext);
	const [state, setState] = useImmer({
		followingLoading: false,
		followRequestCount: 0,
		unfollowRequestCount: 0,
		profileData: {
			profileUsername: '...',
			profileAvatar: 'https://gravatar.com/avatar/placeholder?s=128',
			isFollowing: false,
			counts: { postCount: '', followerCount: '', followingCount: '' }
		}
	});

	//get profile data
	useEffect(() => {
		const axiosRequest = Axios.CancelToken.source();

		async function fetchData() {
			try {
				const res = await Axios.post(`/profile/${username}`, {
					token: appState.user.token
				});
				setState(draft => {
					draft.profileData = res.data;
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
	}, [username]);

	//following request
	useEffect(() => {
		if (state.followRequestCount) {
			setState(draft => {
				draft.followingLoading = true;
			});

			const axiosRequest = Axios.CancelToken.source();

			async function fetchData() {
				try {
					const res = await Axios.post(
						`/addFollow/${state.profileData.profileUsername}`,
						{
							token: appState.user.token
						}
					);
					setState(draft => {
						draft.profileData.isFollowing = true;
						draft.profileData.counts.followerCount++;
						draft.followingLoading = false;
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
		}
	}, [state.followRequestCount]);

	//unfollowing request
	useEffect(() => {
		if (state.unfollowRequestCount) {
			setState(draft => {
				draft.followingLoading = true;
			});

			const axiosRequest = Axios.CancelToken.source();

			async function fetchData() {
				try {
					const res = await Axios.post(
						`/removeFollow/${state.profileData.profileUsername}`,
						{
							token: appState.user.token
						}
					);
					setState(draft => {
						draft.profileData.isFollowing = false;
						draft.profileData.counts.followerCount--;
						draft.followingLoading = false;
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
		}
	}, [state.unfollowRequestCount]);

	function handleStartFollowing() {
		setState(draft => {
			draft.followRequestCount++;
		});
	}

	function handleStopFollowing() {
		setState(draft => {
			draft.unfollowRequestCount++;
		});
	}

	return (
		<div>
			<Page title='Profile'>
				<h2>
					<img className='avatar-small' src={state.profileData.profileAvatar} />{' '}
					{state.profileData.profileUsername}
					{appState.loggedIn &&
						!state.profileData.isFollowing &&
						appState.user.username !== state.profileData.profileUsername &&
						state.profileData.profileUsername !== '...' && (
							<button
								onClick={handleStartFollowing}
								disabled={state.followingLoading}
								className='btn btn-primary btn-sm ml-2'
							>
								Follow <i className='fas fa-user-plus'></i>
							</button>
						)}
					{appState.loggedIn &&
						state.profileData.isFollowing &&
						appState.user.username !== state.profileData.profileUsername &&
						state.profileData.profileUsername !== '...' && (
							<button
								onClick={handleStopFollowing}
								disabled={state.followingLoading}
								className='btn btn-danger btn-sm ml-2'
							>
								Unfollow <i className='fas fa-user-times'></i>
							</button>
						)}
				</h2>

				<div className='profile-nav nav nav-tabs pt-2 mb-4'>
					<NavLink to='' end className='nav-item nav-link'>
						Posts: {state.profileData.counts.postCount}
					</NavLink>
					<NavLink to='followers' className='nav-item nav-link'>
						Followers: {state.profileData.counts.followerCount}
					</NavLink>
					<NavLink to='following' className='nav-item nav-link'>
						Following: {state.profileData.counts.followingCount}
					</NavLink>
				</div>

				<Routes>
					<Route path='' element={<ProfilePosts />} />
					<Route path='followers' element={<ProfileFollowers />} />
					<Route path='following' element={<ProfileFollowing />} />
				</Routes>
			</Page>
		</div>
	);
}

export default ProfileScreen;
