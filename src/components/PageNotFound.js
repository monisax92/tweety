import React from 'react';
import sylvester from '../sylvester.png';
import Page from './Page';
import { Link } from 'react-router-dom';

function PageNotFound() {
	return (
		<Page title='Not found'>
			<div className='center page-not-found'>
				<img src={sylvester} />
				<h1>Are you lost, little bird?</h1>
				<p className='lead text-muted mt-3'>
					Come back to <Link to='/'>homepage</Link>
				</p>
			</div>
		</Page>
	);
}

export default PageNotFound;
