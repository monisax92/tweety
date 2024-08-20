import React, { useEffect, useContext } from 'react';
import { useImmerReducer } from 'use-immer';
import Page from './Page';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Axios from 'axios';
import LoadingAnimation from './LoadingAnimation';
import StateContext from '../StateContext';
import DispatchContext from '../DispatchContext';
import PageNotFound from './PageNotFound';

function EditPostScreen() {
	const navigate = useNavigate();
	const appState = useContext(StateContext);
	const appDispatch = useContext(DispatchContext);

	const originalPost = {
		title: {
			value: '',
			hasErrors: false,
			errorMsg: ''
		},
		body: {
			value: '',
			hasErrors: false,
			errorMsg: ''
		},
		isFetching: true,
		isSaving: false,
		postId: useParams().postId,
		sendCount: 0,
		notFound: false
	};

	function postEditReducer(draft, action) {
		switch (action.type) {
			case 'fetchComplete':
				draft.title.value = action.value.title;
				draft.body.value = action.value.body;
				draft.isFetching = false;
				break;
			case 'titleChange':
				draft.title.hasErrors = false;
				draft.title.value = action.value;
				break;
			case 'bodyChange':
				draft.body.hasErrors = false;
				draft.body.value = action.value;
				break;
			case 'submitUpdates':
				if (!draft.title.hasErrors && !draft.body.hasErrors) draft.sendCount++;
				break;
			case 'saveUpdatesStarted':
				draft.isSaving = true;
				break;
			case 'saveUpdatesFinished':
				draft.isSaving = false;
				break;
			case 'titleRules':
				if (!action.value.trim()) {
					draft.title.hasErrors = true;
					draft.title.errorMsg = 'The title cannot be empty';
				}
				break;
			case 'bodyRules':
				if (!action.value.trim()) {
					draft.body.hasErrors = true;
					draft.body.errorMsg = 'The body cannot be empty';
				}
				break;
			case 'notFound':
				draft.notFound = true;
				break;
		}
	}

	const [state, dispatch] = useImmerReducer(postEditReducer, originalPost);

	function updateSubmitHandler(e) {
		e.preventDefault();
		//check rules in case if user tries to submit without bluring the inputs (so errors will not be produced there)
		dispatch({ type: 'titleRules', value: state.title.value });
		dispatch({ type: 'bodyRules', value: state.body.value });
		dispatch({ type: 'submitUpdates' });
	}

	//   const { postId } = useParams();
	//   const [postLoading, setPostLoading] = useState(true);
	//   const [post, setPost] = useState();

	useEffect(() => {
		const axiosRequest = Axios.CancelToken.source();

		async function fetchPost() {
			try {
				const res = await Axios.get(`/post/${state.postId}`, {
					cancelToken: axiosRequest.token
				});
				if (res.data) {
					dispatch({ type: 'fetchComplete', value: res.data });
					if (appState.user.username !== Response.data.author.username) {
						appDispatch({
							type: 'flashMessage',
							value: 'You do not have permission to edit this post'
						});
						//redirect to homepage
						navigate('/');
					}
				} else {
					dispatch({ type: 'notFound' });
				}
			} catch (err) {
				console.log(err);
			}
		}
		fetchPost();

		//clean-up function
		return () => {
			axiosRequest.cancel();
		};
	}, []);

	useEffect(() => {
		if (state.sendCount) {
			dispatch({ type: 'saveUpdatesStarted' });
			const axiosRequest = Axios.CancelToken.source();

			async function fetchPost() {
				try {
					const res = await Axios.post(
						`/post/${state.postId}/edit`,
						{
							title: state.title.value,
							body: state.body.value,
							token: appState.user.token
						},
						{
							cancelToken: axiosRequest.token
						}
					);
					dispatch({ type: 'saveUpdatesFinished' });
					appDispatch({ type: 'flashMessage', value: 'Post was updated' });
					//   alert("success");
					//   dispatch({ type: "fetchComplete", value: res.data });
				} catch (err) {
					console.log(err);
				}
			}
			fetchPost();

			//clean-up function
			return () => {
				axiosRequest.cancel();
			};
		}
	}, [state.sendCount]);

	if (state.notFound) {
		return <PageNotFound />;
	}

	if (state.isFetching) {
		return (
			<Page title='Loading...'>
				<LoadingAnimation />
			</Page>
		);
	}

	return (
		<Page title='Edit Post'>
			<Link className='small font-weight-bold' to={`/post/${state.postId}`}>
				&laquo; Back to original post
			</Link>
			<form className='mt-3' onSubmit={updateSubmitHandler}>
				<div className='form-group'>
					<label htmlFor='post-title' className='text-muted mb-1'>
						<small>Title</small>
					</label>
					<input
						onChange={e =>
							dispatch({ type: 'titleChange', value: e.target.value })
						}
						// when input loses focus
						onBlur={e =>
							dispatch({ type: 'titleRules', value: e.target.value })
						}
						value={state.title.value}
						autoFocus
						name='title'
						id='post-title'
						className='form-control form-control-lg form-control-title'
						type='text'
						placeholder=''
						autoComplete='off'
					/>
					{state.title.hasErrors && (
						<div className='alert alert-danger small liveValidateMessage'>
							{state.title.errorMsg}
						</div>
					)}
				</div>

				<div className='form-group'>
					<label htmlFor='post-body' className='text-muted mb-1 d-block'>
						<small>Body Content</small>
					</label>
					<textarea
						onChange={e =>
							dispatch({ type: 'bodyChange', value: e.target.value })
						}
						onBlur={e => dispatch({ type: 'bodyRules', value: e.target.value })}
						value={state.body.value}
						name='body'
						id='post-body'
						className='body-content tall-textarea form-control'
						type='text'
					/>
					{state.body.hasErrors && (
						<div className='alert alert-danger small liveValidateMessage'>
							{state.body.errorMsg}
						</div>
					)}
				</div>

				<button className='btn btn-primary' disabled={state.isSaving}>
					{state.isSaving ? 'Saving...' : 'Save Updates'}
				</button>
			</form>
		</Page>
	);
}

export default EditPostScreen;
