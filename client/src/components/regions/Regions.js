import React, { useEffect, useState } 	from 'react';
import {useParams} from "react-router-dom";
import RegionsHeader from "./RegionsHeader";
import * as mutations 					from '../../cache/mutations';
import { useMutation, useQuery } 		from '@apollo/client';
import { GET_DB_SUBREGIONS, GET_DB_MAP_BY_ID} 				from '../../cache/queries';
import RegionsTable from './RegionsTable';
import WCContent from "wt-frontend/build/components/wcard/WCContent";
import { UpdateMapRegions_Transaction } from '../../utils/jsTPS';
import DeleteMapModal 							from '../modals/DeleteMapModal';

const Regions = (props) => {
    const { currentRegionId } = useParams();
	let parentRegion 							= "";
    let regions 							= [];
    const [AddRegion] 			= useMutation(mutations.ADD_MAP);
    const [DeleteRegion] 			= useMutation(mutations.DELETE_MAP);
	const [UpdateRegionField] 	= useMutation(mutations.UPDATE_MAP_FIELD);
	const [UpdateRegionFieldArray] 	= useMutation(mutations.UPDATE_MAP_FIELD_ARRAY);

    const { loading: loadingR, error: errorR, data: dataR, refetch: refetchR } = useQuery(GET_DB_MAP_BY_ID, {variables: {_id: currentRegionId}});
    if(loadingR) { console.log(loadingR, 'loading'); }
    if(errorR) { console.log(errorR, 'error'); }
    if(dataR) { parentRegion = dataR.getMapById; 
    }

	const { loading, error, data, refetch } = useQuery(GET_DB_SUBREGIONS, {variables: {_id: currentRegionId}});
	if(loading) { console.log(loading, 'loading'); }
	if(error) { console.log(error, 'error'); }
	if(data) { regions = data.getAllSubRegions;}

	const createNewRegion = async () => {
		const length = regions.length
		const id = length >= 1 ? regions[length - 1].id + Math.floor((Math.random() * 100) + 1) : 1;

		let region = {
			_id: '',
			id: id,
			name: "Untitled",
			owner: currentRegionId,
            capital: "Untitled",
			leader: "Untitled",
			flag: "Flag",
			landmarks: [],
			subregions: [],
			root: false
		}
		let opcode = 1;
		let regionID = region._id;
		let ownerID = currentRegionId;
		let transaction = new UpdateMapRegions_Transaction(ownerID, regionID, region, opcode, AddRegion, DeleteRegion);
		props.tps.addTransaction(transaction);
		await tpsRedo();
	}

	const cloneArray = (oldArray) => {
		let newArray = [];
		if((typeof oldArray) === 'undefined')
			return new Array;
		for(let i = 0; i< oldArray.length; i++){
			let tempItem = oldArray[i]
			newArray.push(tempItem);
		}
		return newArray;
	}


	const updateRegionField = async (_id, field, value, prev) => {
		if(value !== prev){
            await UpdateRegionField({ variables: { _id: _id, field: field, value: value }})
		}
		await refetchRegions(refetch);
	};


	const updateRegionFieldArray = async (_id, field, value, prev) => {
		await UpdateRegionFieldArray({ variables: { _id: _id, field: field, value: value }})
		await refetchRegion(refetchR);
	};


	const deleteRegion = async (region) => {
		let opcode = 0;
		let ownerID = currentRegionId;
		let regionID = region._id;
		let regionToDelete = {
			_id: region._id,
			id: region.id,
			name: region.name,
			owner: currentRegionId,
            capital: region.capital,
			leader: region.leader,
			flag: region.flag,
			landmarks: [],
			subregions: [],
			root: false
		}
		const index = regions.indexOf(region)
		let transaction = new UpdateMapRegions_Transaction(ownerID ,regionID, regionToDelete ,opcode ,AddRegion, DeleteRegion, index);
		props.tps.addTransaction(transaction);
		tpsRedo();
	}
	const refetchRegion = async (refetchR) => {
		const { loading, error, data } = await refetchR();
		if (data) {
			parentRegion = data.getMapById;
		}
	}

    const refetchRegions = async (refetch) => {
		const { loading, error, data } = await refetch();
		if (data) {
			regions = data.getAllMaps;
		}
	}


	const tpsUndo = async () => {
		const retVal = await props.tps.undoTransaction();
		refetchRegions(refetch);
		return retVal;
	}

	const tpsRedo = async () => {
		const retVal = await props.tps.doTransaction();
		refetchRegions(refetch);
		return retVal;
	}

	const canUndo = () => {
		return props.tps.hasTransactionToUndo();
	  }
	
	const canRedo = () => {
		return props.tps.hasTransactionToRedo();
	  }

	useEffect(() =>{
		refetch();
	}, []);

    return (
         <div class="centered">
             <RegionsHeader currentRegionId={currentRegionId} createNewRegion={createNewRegion} user={props.user} undo={tpsUndo} redo={tpsRedo} canUndo={canUndo()} canRedo={canRedo()}></RegionsHeader>

             <WCContent style={{ backgroundColor: "lightgray", height: "400px"}}>
            
             <RegionsTable regions={regions} editRegion={updateRegionField} deleteRegion={deleteRegion}></RegionsTable>
             </WCContent>
        </div>
    );
}

export default Regions;