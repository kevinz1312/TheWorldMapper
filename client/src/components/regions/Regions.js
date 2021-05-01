import React, { useEffect, useState } 	from 'react';
import {useParams} from "react-router-dom";
import RegionsHeader from "./RegionsHeader";
import * as mutations 					from '../../cache/mutations';
import { useMutation, useQuery } 		from '@apollo/client';
import { GET_DB_MAPS } 				from '../../cache/queries';
import RegionsTable from './RegionsTable';
import WCContent from "wt-frontend/build/components/wcard/WCContent";

const Regions = (props) => {
    const { currentRegionId } = useParams();
    let regions 							= [];
    const [AddRegion] 			= useMutation(mutations.ADD_MAP);

	const { loading, error, data, refetch } = useQuery(GET_DB_MAPS, {variables: {_id: currentRegionId}});
	if(loading) { console.log(loading, 'loading'); }
	if(error) { console.log(error, 'error'); }
	if(data) { regions = data.getAllMaps; }

	const createNewRegion = async () => {
		const length = regions.length
		const id = length >= 1 ? regions[length - 1].id + Math.floor((Math.random() * 100) + 1) : 1;

		let list = {
			_id: '',
			id: id,
			name: "Untitled",
			owner: currentRegionId,
            capital: "Untitled",
			leader: "Untitled",
			flag: "Flag",
            landmarks: [],
		}
		const { data } = await AddRegion({ variables: { map: list }});
		list._id = data;
		await refetchRegions(refetch);
		refetch();
	}

    const refetchRegions = async (refetch) => {
		const { loading, error, data } = await refetch();
		if (data) {
			regions = data.getAllMaps;
		}
	}

	useEffect(() =>{
		refetch();
	}, []);

    return (
         <div class="centered">
             <RegionsHeader currentRegionId={currentRegionId} createNewRegion={createNewRegion} user={props.user}></RegionsHeader>

             <WCContent style={{ backgroundColor: "lightgray", height: "400px"}}>
            
             <RegionsTable regions={regions}> </RegionsTable>
             </WCContent>
        </div>
    );
}

export default Regions;