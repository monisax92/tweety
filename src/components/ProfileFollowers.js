import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Axios from 'axios';
import LoadingAnimation from './LoadingAnimation';

function ProfileFollowers() {
	const { username } = useParams();
	const [followersLoading, setFollowersLoading] = useState(true);
	const [followers, setFollowers] = useState([]);

	useEffect(() => {
		const axiosRequest = Axios.CancelToken.source();

		async function fetchFollowers() {
			try {
				const res = await Axios.get(`/profile/${username}/followers`, {
					cancelToken: axiosRequest.token
				});
				setFollowers(res.data);
				setFollowersLoading(false);
			} catch (err) {
				console.log(err);
			}
		}
		fetchFollowers();

		//clean-up function (e.g. to avoid bug when user clicks somewhere else while Axios still waiting for response)
		return () => {
			axiosRequest.cancel();
		};
	}, [username]);

	if (followersLoading) return <LoadingAnimation />;

	return (
		<div className='list-group'>
			{followers.length === 0
				? `Noone follows ${username}.`
				: followers.map((follower, index) => {
						return (
							<Link
								key={index}
								to={`/profile/${follower.username}`}
								className='list-group-item list-group-item-action'
							>
								<img className='avatar-tiny' src={follower.avatar} />{' '}
								{follower.username}
							</Link>
						);
				  })}
		</div>
	);
}

export default ProfileFollowers;
