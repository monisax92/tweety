import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Axios from 'axios';
import LoadingAnimation from './LoadingAnimation';
import Post from './Post';

function ProfilePosts() {
	const { username } = useParams();
	const [postsLoading, setPostsLoading] = useState(true);
	const [posts, setPosts] = useState([]);

	useEffect(() => {
		const axiosRequest = Axios.CancelToken.source();

		async function fetchPosts() {
			try {
				const res = await Axios.get(`/profile/${username}/posts`, {
					cancelToken: axiosRequest.token
				});
				setPosts(res.data);
				setPostsLoading(false);
			} catch (err) {
				console.log(err);
			}
		}
		fetchPosts();

		//clean-up function (e.g. to avoid bug when user clicks somewhere else while Axios still waiting for response)
		return () => {
			axiosRequest.cancel();
		};
	}, [username]);

	if (postsLoading) return <LoadingAnimation />;

	return (
		<div className='list-group'>
			{posts.map(post => {
				return <Post post={post} noAuthor={true} />;
			})}
		</div>
	);
}

export default ProfilePosts;
