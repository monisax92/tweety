import React, { useState, useEffect, useContext } from 'react';
import Page from './Page';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import LoadingAnimation from './LoadingAnimation';
import PageNotFound from './PageNotFound';
import StateContext from '../StateContext';
import DispatchContext from '../DispatchContext';

function SinglePostScreen() {
	const navigate = useNavigate();
	const appState = useContext(StateContext);
	const appDispatch = useContext(DispatchContext);
	const { postId } = useParams();
	const [postLoading, setPostLoading] = useState(true);
	const [post, setPost] = useState();

	useEffect(() => {
		const axiosRequest = Axios.CancelToken.source();

		async function fetchPost() {
			try {
				const res = await Axios.get(`/post/${postId}`, {
					cancelToken: axiosRequest.token
				});
				// console.log(res.data);
				setPost(res.data);
				setPostLoading(false);
			} catch (err) {
				console.log(err);
			}
		}
		fetchPost();

		//clean-up function
		return () => {
			axiosRequest.cancel();
		};
		//to be able to redirect to other post from search overlay
	}, [postId]);

	if (!postLoading && !post) {
		return <PageNotFound />;
	}

	if (postLoading) {
		return (
			<Page title='Loading...'>
				<LoadingAnimation />
			</Page>
		);
	}
	let createdDate = new Date(post.createdDate);
	let dateFormatted = `${createdDate.getDate()}/${
		createdDate.getMonth() + 1
	}/${createdDate.getFullYear()}`;

	function isOwner() {
		if (appState.loggedIn)
			return appState.user.username === post.author.username;
		else return false;
	}

	async function deletePostHandler() {
		const confirmed = window.confirm(
			'Are you sure you want to delete this post? This action cannot be undone!'
		);
		if (confirmed) {
			try {
				const res = await Axios.delete(`/post/${postId}`, {
					data: { token: appState.user.token }
				});
				if (res.data === 'Success') {
					appDispatch({
						type: 'flashMessage',
						value: 'Post was successfully deleted!'
					});
					navigate(`/profile/${appState.user.username}`);
				}
			} catch (e) {
				console.log('Something went wrong while deleting post...');
			}
		}
	}

	return (
		<Page title={post.title}>
			<div className='d-flex justify-content-between'>
				<h2>{post.title}</h2>
				{isOwner() && (
					<span className='pt-2'>
						{/* update icon */}
						<Link
							to={`/post/${post._id}/edit`}
							data-tooltip-content='Edit post'
							data-tooltip-id='edit'
							className='text-primary mr-2'
						>
							<i className='fas fa-edit'></i>
						</Link>
						<ReactTooltip id='edit' className='custom-tooltip' />{' '}
						{/* delete icon */}
						<a
							data-tooltip-content='Delete post'
							data-tooltip-id='delete'
							className='delete-post-button text-danger'
							onClick={deletePostHandler}
						>
							<i className='fas fa-trash'></i>
						</a>
						<ReactTooltip id='delete' className='custom-tooltip' />
					</span>
				)}
			</div>

			<p className='text-muted small mb-4'>
				<Link to={`/profile/${post.author.username}`}>
					<img className='avatar-tiny' src={post.author.avatar} />
				</Link>
				Posted by{' '}
				<Link to={`/profile/${post.author.username}`}>
					{post.author.username}
				</Link>{' '}
				on {dateFormatted}
			</p>

			<div className='body-content'>
				<ReactMarkdown
					children={post.body}
					allowElemens={[
						'p',
						'br',
						'strong',
						'em',
						'h1',
						'h2',
						'h3',
						'h4',
						'h5',
						'h6',
						'ul',
						'ol',
						'li'
					]}
				/>
			</div>
		</Page>
	);
}

export default SinglePostScreen;
