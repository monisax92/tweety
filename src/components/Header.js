import React, { useContext } from 'react';
import logo from '../Tweety.png';
import { Link } from 'react-router-dom';
import HeaderGuest from './HeaderGuest';
import HeaderUser from './HeaderUser';
import StateContext from '../StateContext';

function Header(props) {
	const appState = useContext(StateContext);

	return (
		<header className='header-bar mb-3'>
			<div className='container d-flex flex-column flex-md-row align-items-center p-3'>
				<h4 className='my-0 mr-md-auto font-weight-normal'>
					<Link
						to='/'
						className='text-white flex-wrapper flex-horizontal no-deco'
					>
						<img src={logo} alt='logo' className='logo-img'></img>
						<div className='flex-wrapper flex-vertical logo-div'>
							<p>Tweety </p>
							<small>little Twitter</small>
						</div>
					</Link>
				</h4>
				{appState.loggedIn ? (
					<HeaderUser setLoggedIn={props.setLoggedIn} />
				) : (
					<HeaderGuest setLoggedIn={props.setLoggedIn} />
				)}
			</div>
		</header>
	);
}

export default Header;
