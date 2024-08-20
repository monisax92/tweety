import React, { useEffect, useContext } from 'react';
import { useImmerReducer } from 'use-immer';
import Page from './Page';
import Axios from 'axios';
import {CSSTransition} from "react-transition-group";
import DispatchContext from '../DispatchContext';

function HomeGuest() {
	const appDispatch = useContext(DispatchContext);

	const initialState = {
		username: {
			value: "",
			hasErrors: false,
			errMessage: "",
			isUnique: false,
			checkTrigger: 0
		},
		email: {
			value: "",
			hasErrors: false,
			errMessage: "",
			isUnique: false,
			checkTrigger: 0
		},
		password: {
			value: "",
			hasErrors: false,
			errMessage: "",
		},
		submitTrigger: 0
	}

	function registerFormReducer(draft, action) {
		switch (action.type) {
			case "usernameImmediately":
				draft.username.hasErrors = false;
				draft.username.value = action.value;
				if(draft.username.value.length > 30) {
					draft.username.hasErrors = true;
					draft.username.errMessage = "Username cannot exceed 30 characters.";
				}
				if(draft.username.value && !/^([a-zA-Z0-9]+)$/.test(draft.username.value)) {
					draft.username.hasErrors = true;
					draft.username.errMessage = "Username can only contain letters and numbers.";
				}
				break;
			case "usernameAfterDelay":
				if(draft.username.value.length < 3) {
					draft.username.hasErrors = true;
					draft.username.errMessage = "Username must be at least 3 characters long.";
				}
				if(!draft.username.hasErrors && !action.noRequest) {
					draft.username.checkTrigger++;
				}
				break;
			case "usernameUniqueResults":
				if(action.value) {
					draft.username.hasErrors = true;
					draft.username.isUnique = false;
					draft.username.errMessage = "That username is already in use. Try something else.";
				} else {
					draft.username.isUnique = true;
				}
				break;
			case "emailImmediately":
				draft.email.hasErrors = false;
				draft.email.value = action.value;
				break;
			case "emailAfterDelay":
				if(!/^\S+@\S+$/.test(draft.email.value)) {
					draft.email.hasErrors = true;
					draft.email.errMessage = "Provide a valid email address."
				}
				if(!draft.email.hasErrors && !action.noRequest) {
					draft.email.checkTrigger++;
				}
				break;
			case "emailUniqueResults":
				if(action.value) {
					draft.email.hasErrors = true;
					draft.email.isUnique = false;
					draft.email.errMessage = "That email is already in use.";
				} else {
					draft.email.isUnique = true;
				}
				break;
			case "passwordImmediately":
				draft.password.hasErrors = false;
				draft.password.value = action.value;
				if(draft.password.value.length > 50) {
					draft.password.hasErrors = true;
					draft.password.errMessage = "Password cannot exceed 50 characters.";
				}
				break;
			case "passwordAfterDelay":
				if (draft.password.value.length < 12) {
					draft.password.hasErrors = true;
					draft.password.errMessage = "Password must be at least 12 characters long.";
				}
				break;
			case "submitForm":
				if (!draft.username.hasErrors && draft.username.isUnique && !draft.email.hasErrors && draft.email.isUnique && !draft.password.hasErrors) {
					draft.submitTrigger++;
				}
				break;
		}
	}

	const [state, dispatch] = useImmerReducer(registerFormReducer, initialState);

	useEffect(() => {
		if(state.username.value) {
			const delay = setTimeout(() => dispatch({type: "usernameAfterDelay"}), 800);
			return () => clearTimeout(delay);
		}
	}, [state.username.value])

		useEffect(() => {
		if(state.email.value) {
			const delay = setTimeout(() => dispatch({type: "emailAfterDelay"}), 800);
			return () => clearTimeout(delay);
		}
	}, [state.email.value])

		useEffect(() => {
		if(state.password.value) {
			const delay = setTimeout(() => dispatch({type: "passwordAfterDelay"}), 800);
			return () => clearTimeout(delay);
		}
	}, [state.password.value])

	useEffect(() => {
		//do not send on first render
		if (state.username.checkTrigger) {
			const request = Axios.CancelToken.source();
			async function isUsernameTaken() {
				try {
					const response = await Axios.post(
						'/doesUsernameExist',
						{ username: state.username.value },
						{ cancelToken: request.token }
					);
					dispatch({type: "usernameUniqueResults", value: response.data});
				} catch (e) {
					console.log(
						'Something went wrong while fetching matching posts or the request was cancelled.'
					);
				}
			}
			isUsernameTaken();
			return () => request.cancel();
		}
	}, [state.username.checkTrigger]);

	useEffect(() => {
		//do not send on first render
		if (state.email.checkTrigger) {
			const request = Axios.CancelToken.source();
			async function isEmailTaken() {
				try {
					const response = await Axios.post(
						'/doesEmailExist',
						{ email: state.email.value },
						{ cancelToken: request.token }
					);
					dispatch({type: "emailUniqueResults", value: response.data});
				} catch (e) {
					console.log(
						'Something went wrong while fetching matching posts or the request was cancelled.'
					);
				}
			}
			isEmailTaken();
			return () => request.cancel();
		}
	}, [state.email.checkTrigger]);

	useEffect(() => {
		//do not send on first render
		if (state.submitTrigger) {
			const request = Axios.CancelToken.source();
			async function submitRegister() {
				try {
					const response = await Axios.post(
						'/register',
						{ username: state.username.value,
							email: state.email.value,
							password: state.password.value
						 },
						{ cancelToken: request.token }
					);
					appDispatch({type: "login", data: response.data});
					appDispatch({type: "flashMessage", value: "Congrats! You've been successfully registered."})
				} catch (e) {
					console.log(
						'Something went wrong while fetching matching posts or the request was cancelled.'
					);
				}
			}
			submitRegister();
			return () => request.cancel();
		}
	}, [state.submitTrigger]);

	function handleRegisterSubmit(e) {
		e.preventDefault();
		//frontend validation
		dispatch({type: "usernameImmediately", value: state.username.value});
		dispatch({type: "usernameAfterDelay", value: state.username.value, noRequest: true});
		dispatch({type: "emailImmediately", value: state.email.value});
		dispatch({type: "emailAfterDelay", value: state.email.value, noRequest: true});
		dispatch({type: "passwordImmediately", value: state.password.value});
		dispatch({type: "passwordAfterDelay", value: state.password.value});
		dispatch({type: "submitForm"})
	}

	return (
		<Page title='Home' wider={true}>
			<div className='row align-items-center'>
				<div className='col-lg-7 py-3 py-md-5'>
					<h1 className='display-3'>Hi, Looney Tweety!</h1>
					<p className='lead text-muted'>
						Are you sick of short tweets and impersonal &ldquo;shared&rdquo;
						posts that are reminiscent of the late 90&rsquo;s email forwards? We
						believe getting back to actually writing is the key to enjoying the
						internet again.
					</p>
				</div>
				<div className='col-lg-5 pl-lg-5 pb-3 py-lg-5'>
					<form onSubmit={handleRegisterSubmit}>
						<div className='form-group'>
							<label htmlFor='username-register' className='text-muted mb-1'>
								<small>Username</small>
							</label>
							<input
								onChange={e => dispatch({type: "usernameImmediately", value: e.target.value})}
								id='username-register'
								name='username'
								className='form-control'
								type='text'
								placeholder='Pick a username'
								autoComplete='off'
							/>
							<CSSTransition in={state.username.hasErrors} timeout={330} classNames="liveValidateMessage" unmountOnExit>
								<div className="alert alert-danger small liveValidateMessage">
									{state.username.errMessage}
								</div>
							</CSSTransition>
						</div>
						<div className='form-group'>
							<label htmlFor='email-register' className='text-muted mb-1'>
								<small>Email</small>
							</label>
							<input
								onChange={e => dispatch({type: "emailImmediately", value: e.target.value})}
								id='email-register'
								name='email'
								className='form-control'
								type='text'
								placeholder='you@example.com'
								autoComplete='off'
							/>
							<CSSTransition in={state.email.hasErrors} timeout={330} classNames="liveValidateMessage" unmountOnExit>
								<div className="alert alert-danger small liveValidateMessage">
									{state.email.errMessage}
								</div>
							</CSSTransition>
						</div>
						<div className='form-group'>
							<label htmlFor='password-register' className='text-muted mb-1'>
								<small>Password</small>
							</label>
							<input
								onChange={e => dispatch({type: "passwordImmediately", value: e.target.value})}
								id='password-register'
								name='password'
								className='form-control'
								type='password'
								placeholder='Create a password'
							/>
							<CSSTransition in={state.password.hasErrors} timeout={330} classNames="liveValidateMessage" unmountOnExit>
								<div className="alert alert-danger small liveValidateMessage">
									{state.password.errMessage}
								</div>
							</CSSTransition>
						</div>
						<button
							type='submit'
							className='py-3 mt-4 btn btn-lg btn-success btn-block'
						>
							Sign up for Tweety
						</button>
					</form>
				</div>
			</div>
		</Page>
	);
}

export default HomeGuest;
