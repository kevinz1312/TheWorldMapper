import React                                from 'react';
import { LOGOUT }                           from '../../cache/mutations';
import { useMutation, useApolloClient }     from '@apollo/client';
import { WButton, WNavItem }                from 'wt-frontend';
import { useHistory } from "react-router-dom";

const LoggedIn = (props) => {
    const history = useHistory();
    const client = useApolloClient();
	const [Logout] = useMutation(LOGOUT);
    const handleLogout = async (e) => {
        // history.push("/welcome/");
        Logout();
        history.push("/welcome/");
        history.go(0)
        const { data } = await props.fetchUser();
        if (data) {
            let reset = await client.resetStore();
            // if (reset) props.setActiveList({});
        }
    };

    return (
        <>
        <WNavItem hoverAnimation="lighten">
            <WButton className="navbar-name" onClick={props.setShowUpdate} wType="texted" hoverAnimation="text-primary">
                {`${props.user.name}`}
            </WButton>
        </WNavItem>
        <WNavItem hoverAnimation="lighten">
            <WButton className="navbar-options" onClick={handleLogout} wType="texted" hoverAnimation="text-primary">
                Logout
            </WButton>
        </WNavItem>
        
        </>
    );
};

const LoggedOut = (props) => {
    return (
        <>
            <WNavItem hoverAnimation="lighten">
                <WButton className="navbar-options" onClick={props.setShowLogin} wType="texted" hoverAnimation="text-primary">
                    Login
                </WButton>
            </WNavItem>
            <WNavItem hoverAnimation="lighten">
                <WButton className="navbar-options" onClick={props.setShowCreate} wType="texted" hoverAnimation="text-primary"> 
                    Sign Up 
                </WButton>
            </WNavItem>
        </>
    );
};


const NavbarOptions = (props) => {
    return (
        <>
            {
                props.auth === false ? <LoggedOut setShowLogin={props.setShowLogin} setShowCreate={props.setShowCreate} />
                : <LoggedIn fetchUser={props.fetchUser} setActiveList={props.setActiveList} logout={props.logout } user={props.user} setShowUpdate={props.setShowUpdate}/>
            }
        </>

    );
};

export default NavbarOptions;