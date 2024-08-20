import React, { useContext, useState } from 'react';
import Axios from 'axios';
import DispatchContext from '../DispatchContext';

function HeaderGuest() {
	const appDispatch = useContext(DispatchContext);

	const [username, setUsername] = useState();
	const [password, setPassword] = useState();

	async function handleLoginSubmit(e) {
		e.preventDefault();
		try {
			const res = await Axios.post('/login', {
				username,
				password
			});
			if (res.data) {
				appDispatch({ type: 'login', data: res.data });
				appDispatch({type: "flashMessage", value: "You've successfully logged in!"});
			} else {
				console.log('incorrect username or password');
				appDispatch({type: "flashMessage", value: "Invalid username and/or password."})
			}
		} catch (err) {
			console.log('error: ', err);
		}
	}

	return (
		<form onSubmit={handleLoginSubmit} className='mb-0 pt-2 pt-md-0'>
			<div className='row align-items-center'>
				<div className='col-md mr-0 pr-md-0 mb-3 mb-md-0'>
					<input
						onChange={e => setUsername(e.target.value)}
						name='username'
						className='form-control form-control-sm input-light'
						type='text'
						placeholder='Username'
						autoComplete='off'
					/>
				</div>
				<div className='col-md mr-0 pr-md-0 mb-3 mb-md-0'>
					<input
						onChange={e => setPassword(e.target.value)}
						name='password'
						className='form-control form-control-sm input-light'
						type='password'
						placeholder='Password'
					/>
				</div>
				<div className='col-md-auto'>
					<button className='btn btn-sm btn-main'>Sign In</button>
				</div>
			</div>
		</form>
	);
}

export default HeaderGuest;
