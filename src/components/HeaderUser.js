import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import DispatchContext from '../DispatchContext';
import StateContext from '../StateContext';
import { Tooltip as ReactTooltip } from 'react-tooltip';

function HeaderUser() {
	const appState = useContext(StateContext);
	const appDispatch = useContext(DispatchContext);

	function handleLogOut() {
		appDispatch({ type: 'logout' });
		appDispatch({type: "flashMessage", value: "You've successfully logged out."})
	}

	function handleOpenSearch() {
		appDispatch({ type: 'openSearch' });
	}

	return (
		<div className='flex-row my-3 my-md-0'>
			<a
				onClick={handleOpenSearch}
				href='#'
				className='text-white mr-2 header-search-icon'
				data-tooltip-content='Search posts'
				data-tooltip-id='search'
			>
				<i className='fas fa-search'></i>
			</a>
			<ReactTooltip place='bottom' id='search' className='custom-tooltip' />{' '}
			<span
				onClick={() => appDispatch({ type: 'toggleChat' })}
				className={
					'mr-2 header-chat-icon' +
					(appState.unreadMsgsCount === 0 ? ' text-white' : '')
				}
				data-tooltip-content='Chat'
				data-tooltip-id='chat'
			>
				<i className='fas fa-comment'></i>
				{appState.unreadMsgsCount > 0 ? (
					<span className='chat-count-badge text-white'>
						{appState.unreadMsgsCount}
					</span>
				) : (
					''
				)}
			</span>
			<ReactTooltip place='bottom' id='chat' className='custom-tooltip' />{' '}
			<Link
				to={`/profile/${appState.user.username}`}
				className='mr-2'
				data-tooltip-content='My profile'
				data-tooltip-id='own-profile'
			>
				<img
					className='small-header-avatar'
					alt='user'
					src={appState.user.avatar}
				/>
			</Link>
			<ReactTooltip
				place='bottom'
				id='own-profile'
				className='custom-tooltip'
			/>{' '}
			<Link className='btn btn-sm btn-success mr-2' to='/create-post'>
				Create Post
			</Link>{' '}
			<button onClick={handleLogOut} className='btn btn-sm btn-secondary'>
				Sign Out
			</button>
		</div>
	);
}

export default HeaderUser;
