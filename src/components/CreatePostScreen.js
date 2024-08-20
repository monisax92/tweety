import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Page from './Page';
import Axios from 'axios';
import DispatchContext from '../DispatchContext';
import StateContext from '../StateContext';

function CreatePostScreen() {
	const appDispatch = useContext(DispatchContext);
	const appState = useContext(StateContext);

	const [title, setTitle] = useState();
	const [body, setBody] = useState();
	const navigate = useNavigate();

	async function handleCreatePost(e) {
		e.preventDefault();
		try {
			const res = await Axios.post('/create-post', {
				title,
				body,
				token: appState.user.token
			});
			appDispatch({ type: 'flashMessage', value: 'You added new post!' });
			//   props.addFlashMessage("You added new post!");
			navigate(`/post/${res.data}`);
			console.log('New post was created');
		} catch (err) {
			console.log('There was some problem creating the post.');
		}
	}

	return (
		<Page title='Create New Post'>
			<form onSubmit={handleCreatePost}>
				<div className='form-group'>
					<label htmlFor='post-title' className='text-muted mb-1'>
						<small>Title</small>
					</label>
					<input
						autoFocus
						name='title'
						id='post-title'
						className='form-control form-control-lg form-control-title'
						type='text'
						placeholder=''
						autoComplete='off'
						onChange={e => setTitle(e.target.value)}
					/>
				</div>

				<div className='form-group'>
					<label htmlFor='post-body' className='text-muted mb-1 d-block'>
						<small>Body Content</small>
					</label>
					<textarea
						name='body'
						id='post-body'
						className='body-content tall-textarea form-control'
						type='text'
						onChange={e => setBody(e.target.value)}
					></textarea>
				</div>

				<button className='btn btn-primary'>Save New Post</button>
			</form>
		</Page>
	);
}

export default CreatePostScreen;
