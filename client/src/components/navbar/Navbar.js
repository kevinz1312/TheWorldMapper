import React, { useState, useEffect } 	from 'react';
import { WNavbar, WNavItem } 	from 'wt-frontend';
import { WLayout, WLHeader} from 'wt-frontend';
import Logo from '../navbar/Logo';
import NavbarOptions from '../navbar/NavbarOptions';
import Login 							from '../modals/Login';
import CreateAccount 					from '../modals/CreateAccount';
import UpdateAccount 					from '../modals/UpdateAccount';

const Navbar = (props) => {
	const [showUpdate, toggleShowUpdate] 	= useState(false);
	const [showLogin, toggleShowLogin] 		= useState(false);
	const [showCreate, toggleShowCreate] 	= useState(false);

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
            <ul>
                <NavbarOptions
                    fetchUser={props.fetchUser} auth={props.auth} 
                    setShowCreate={setShowCreate} setShowLogin={setShowLogin} setShowUpdate={setShowUpdate}
                    // refetchTodos={refetch}
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