import React 			from 'react';
import { WLayout, WLHeader, WLMain} from 'wt-frontend';

import Navbar 		from './components/navbar/Navbar';
import { useQuery } 	from '@apollo/client';
import * as queries 	from './cache/queries';
import { jsTPS } 		from './utils/jsTPS';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import WelcomeScreen from './components/welcome/WelcomeScreen';
import Maps from './components/maps/Maps';
import Regions from './components/regions/Regions';
import RegionViewer from './components/regions/RegionViewer';
 
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
				<Switch>
					<Redirect exact from="/" to={ {pathname: "/welcome"} } />
					<Route 
						path="/welcome" 
						name="welcome" 
						render={() => 
							auth ? <Redirect to="/maps"/> :
							<>
							<WLHeader>
								<Navbar 
									fetchUser={refetch} auth={auth}  
									user={user}/>
							</WLHeader>
							<WLMain>
								<WelcomeScreen/>
							</WLMain>
							</>
						} />
					<Route 
						path="/maps" 
						name="maps" 
						render={() =>
							!auth ? <Redirect to="/welcome"/> :
							<>
							<WLHeader>
								<Navbar 
									fetchUser={refetch} auth={auth}  
									user={user} tps={transactionStack}/>
							</WLHeader>
							<WLMain>
								<Maps user={user}/>
							</WLMain>
							</>
						} />

					<Route 
						path="/regions/:currentRegionId" 
						name="region" 
						render={() =>
							<>
							<WLHeader>
								<Navbar 
									fetchUser={refetch} auth={auth}  
									user={user} tps={transactionStack}/>
							</WLHeader>
							<WLMain>
								<Regions user={user} tps={transactionStack}/>
							</WLMain>
							</>
						} />

					<Route 
						path="/regionviewer/:currentRegionId" 
						name="region viewer" 
						render={() =>
							// !auth ? <Redirect to="/welcome"/> :
							<>
							<WLHeader>
								<Navbar 
									fetchUser={refetch} auth={auth}  
									user={user} tps={transactionStack}/>
							</WLHeader>
							<WLMain>
								<RegionViewer user={user} tps={transactionStack}/>
							</WLMain>
							</>
						} />

				</Switch>
			</WLayout>
		</BrowserRouter>
	);
}

export default App;