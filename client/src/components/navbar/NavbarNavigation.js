import { useMutation, useQuery } 		from '@apollo/client';
import { GET_DB_MAPS_ANCESTORS } 				from '../../cache/queries';
import NavbarNavigationEntry from '../navbar/NavbarNavigationEntry';
import React, { useEffect, useState } 	from 'react';

const NavbarNavigation = (props) => {
    let ancestorRegions = [];
    const currentRegionId = props.currentRegionId;

    const { loading, error, data, refetch } = useQuery(GET_DB_MAPS_ANCESTORS, {variables: {_id: currentRegionId}});
    if(loading) { console.log(loading, 'loading'); }
    if(error) { console.log(error, 'error'); }
    if(data) { ancestorRegions = data.getDBMapAncestors;}

    useEffect(() =>{
		refetch();
	}, []);
    
    return (
        <div className="navbar-navigation-container">
        {   ancestorRegions.length > 0 ?
            ancestorRegions.map(region => (
                <li>
                <NavbarNavigationEntry
                key={region._id} name={region.name} _id={region._id} owner={region.owner} user_id={props.user._id}
                tps={props.tps}
                /></li>
            )) : <></>
        }
        </div>
    );
};
export default NavbarNavigation;