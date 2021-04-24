import React 			from 'react';
import { WLayout, WLHeader, WLMain} from 'wt-frontend';

import Navbar 		from './components/navbar/Navbar';
import { useQuery } 	from '@apollo/client';
import * as queries 	from './cache/queries';
import { jsTPS } 		from './utils/jsTPS';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import WelcomeScreen from './components/welcome/WelcomeScreen';
import Maps from './components/maps/Maps';
 
const App = () => {
	let user = null;
	let auth = false;

    let transactionStack = new jsTPS();
    const { loading, error, data, refetch } = useQuery(queries.GET_DB_USER);

    if(error) { console.log(error); }
	if(loading) { console.log(loading); }
	if(data) { 
		let { getCurrentUser } = data;
		if(getCurrentUser !== null) { user = getCurrentUser; auth = true}
	}

	return(
		<BrowserRouter>
			<WLayout wLayout="header">
				<WLHeader>
					<Navbar 
						fetchUser={refetch} auth={auth} 
						user={user}/>
				</WLHeader>
				<Switch>
					<Redirect exact from="/" to={ {pathname: "/welcome"} } />
					<Route 
						path="/welcome" 
						name="welcome" 
						render={() => 
							<WLMain>
								<WelcomeScreen/>
							</WLMain>
						} />
					

					<Route 
						path="/maps" 
						name="maps" 
						render={() => 
							<WLMain>
								<Maps/>
							</WLMain>
						} />

				</Switch>
			</WLayout>
		</BrowserRouter>
	);
}

export default App;