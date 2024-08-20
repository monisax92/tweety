import React, { useEffect, useContext, useRef } from 'react';
import StateContext from '../StateContext';
import DispatchContext from '../DispatchContext';
import { useImmer } from 'use-immer';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';

function ChatBox() {
	const socket = useRef(null);
	const chatField = useRef(null);
	const chatLog = useRef(null);
	const appState = useContext(StateContext);
	const appDispatch = useContext(DispatchContext);
	const [state, setState] = useImmer({
		msgFieldValue: '',
		chatMessages: []
	});

	//for autofocus msg form when chat gets open
	//AND for clearing unread msgs label when chat gets open
	useEffect(() => {
		if (appState.isChatOpen) {
			chatField.current.focus();
			appDispatch({ type: 'clearUnreadMsgs' });
		}
	}, [appState.isChatOpen]);

	useEffect(() => {
		socket.current = io(process.env.BACKENDURL || 'https://tweety-backend-1o5v.onrender.com');

		socket.current.on('chatFromServer', msg => {
			setState(draft => {
				draft.chatMessages.push(msg);
			});
		});
		return () => socket.current.disconnect();
	}, []);

	//handle autoscroll to the bottom on every msg sent
	//AND showing unread messages nr if chat is closed
	useEffect(() => {
		chatLog.current.scrollTop = chatLog.current.scrollHeight;

		if (state.chatMessages.length && !appState.isChatOpen) {
			appDispatch({ type: 'addUnreadMsg' });
		}
	}, [state.chatMessages]);

	function handleMsgFieldChange(e) {
		const value = e.target.value;
		setState(draft => {
			draft.msgFieldValue = value;
		});
	}

	function handleSubmit(e) {
		e.preventDefault();
		//sending message to the chat server
		//(chatFromBrowser is the name of event type which is determined in backend, and we send token not just username in second parameter's object because we want our server to be able to trust who is it)
		socket.current.emit('chatFromBrowser', {
			message: state.msgFieldValue,
			token: appState.user.token
		});

		setState(draft => {
			draft.chatMessages.push({
				message: draft.msgFieldValue,
				username: appState.user.username,
				avatar: appState.user.avatar
			});
			draft.msgFieldValue = '';
		});
	}

	return (
		<div
			id='chat-wrapper'
			className={
				'chat-wrapper shadow border-top border-left border-right ' +
				(appState.isChatOpen ? 'chat-wrapper--is-visible' : '')
			}
		>
			<div className='chat-title-bar'>
				Almost chat
				<span
					onClick={() => appDispatch({ type: 'closeChat' })}
					className='chat-title-bar-close'
				>
					<i className='fas fa-times-circle'></i>
				</span>
			</div>
			<div id='chat' className='chat-log' ref={chatLog}>
				{/* {console.log(num++, state.chatMessages)} */}
				{state.chatMessages.map((msg, index) => {
					// console.log(msg);
					if (msg.username === appState.user.username) {
						return (
							<div key={index} className='chat-self'>
								<div className='chat-message'>
									<div className='chat-message-inner'>{msg.message}</div>
								</div>
								<img className='chat-avatar avatar-tiny' src={msg.avatar} />
							</div>
						);
					}
					return (
						<div key={index} className='chat-other'>
							<Link to={`/profile/${msg.username}`}>
								<img className='avatar-tiny' src={msg.avatar} />
							</Link>
							<div className='chat-message'>
								<div className='chat-message-inner'>
									<Link to={`/profile/${msg.username}`}>
										<strong>{msg.username}: </strong>
									</Link>
									{msg.message}
								</div>
							</div>
						</div>
					);
				})}
			</div>
			<form
				onSubmit={handleSubmit}
				id='chatForm'
				className='chat-form border-top'
			>
				<input
					onChange={handleMsgFieldChange}
					value={state.msgFieldValue}
					ref={chatField}
					type='text'
					className='chat-field'
					id='chatField'
					placeholder='Type a message…'
					autoComplete='off'
				/>
			</form>
		</div>
	);
}

export default ChatBox;
