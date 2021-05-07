import React, { useEffect, useState } 	from 'react';
import { WNavbar, WNavItem } 	from 'wt-frontend';
import Logo from '../navbar/Logo';
import NavbarOptions from '../navbar/NavbarOptions';
import NavbarNavigation from '../navbar/NavbarNavigation';
import Login 							from '../modals/Login';
import CreateAccount 					from '../modals/CreateAccount';
import UpdateAccount 					from '../modals/UpdateAccount';
import {useParams} from "react-router-dom";

const Navbar = (props) => {
	const [showUpdate, toggleShowUpdate] 	= useState(false);
	const [showLogin, toggleShowLogin] 		= useState(false);
	const [showCreate, toggleShowCreate] 	= useState(false);
	let { currentRegionId } = useParams();

	const setShowLogin = () => {
		toggleShowUpdate(false);
		toggleShowCreate(false);
		toggleShowLogin(!showLogin);
	};

	const setShowCreate = () => {
		toggleShowUpdate(false);
		toggleShowLogin(false);
		toggleShowCreate(!showCreate);
	};
    
	const setShowUpdate = () => {
		console.log(props.auth)
		toggleShowCreate(false);
		toggleShowLogin(false);
		toggleShowUpdate(!showUpdate);
	};

    return (
        <>
        <WNavbar color="colored">
            <ul>
                <WNavItem>
                    <Logo className='logo' />
                </WNavItem>
            </ul>

			{ ((typeof currentRegionId) === 'undefined') || (props.auth === 'false') ?
			<></>:
			<ul>
				<NavbarNavigation currentRegionId = {currentRegionId} user={props.user} auth={props.auth} tps={props.tps}></NavbarNavigation>
			</ul>
			
			}


            <ul>
                <NavbarOptions
                    fetchUser={props.fetchUser} auth={props.auth} 
                    setShowCreate={setShowCreate} setShowLogin={setShowLogin} setShowUpdate={setShowUpdate}
                    user={props.user}

                />
            </ul>
        </WNavbar>

			{
				showCreate && (<CreateAccount fetchUser={props.fetchUser} setShowCreate={setShowCreate} />)
			}

			{
				showLogin && (<Login fetchUser={props.fetchUser} setShowLogin={setShowLogin} />)
			}

			{
				showUpdate && (<UpdateAccount fetchUser={props.fetchUser} setShowUpdate={setShowUpdate} user={props.user}/>)
			}
            </>
    );
};

export default Navbar;