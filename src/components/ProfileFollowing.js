import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Axios from 'axios';
import LoadingAnimation from './LoadingAnimation';

function ProfileFollowing() {
	const { username } = useParams();
	const [followingLoading, setFollowingLoading] = useState(true);
	const [following, setFollowing] = useState([]);

	useEffect(() => {
		const axiosRequest = Axios.CancelToken.source();

		async function fetchFollowing() {
			try {
				const res = await Axios.get(`/profile/${username}/following`, {
					cancelToken: axiosRequest.token
				});
				setFollowing(res.data);
				setFollowingLoading(false);
			} catch (err) {
				console.log(err);
			}
		}
		fetchFollowing();

		//clean-up function (e.g. to avoid bug when user clicks somewhere else while Axios still waiting for response)
		return () => {
			axiosRequest.cancel();
		};
	}, [username]);

	if (followingLoading) return <LoadingAnimation />;

	return (
		<div className='list-group'>
			{following.length === 0
				? `${username} does not follow anyone.`
				: following.map((followWho, index) => {
						return (
							<Link
								key={index}
								to={`/profile/${followWho.username}`}
								className='list-group-item list-group-item-action'
							>
								<img className='avatar-tiny' src={followWho.avatar} />{' '}
								{followWho.username}
							</Link>
						);
				  })}
		</div>
	);
}

export default ProfileFollowing;
