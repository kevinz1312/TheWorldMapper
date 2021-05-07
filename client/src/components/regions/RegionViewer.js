import React, { useEffect, useState } 	from 'react';
import {useParams} from "react-router-dom";
import RegionViewerTable from "./RegionViewerTable";
import DeleteLandmarkModal 							from '../modals/DeleteLandmarkModal';
import * as mutations 					from '../../cache/mutations';
import { useMutation, useQuery } 		from '@apollo/client';
import { GET_DB_MAP_BY_ID, GET_DB_MAPS, GET_DB_MAPS_ANCESTORS } 				from '../../cache/queries';
import WCContent from "wt-frontend/build/components/wcard/WCContent";
import { useHistory } from "react-router-dom";
import { WRow,WInput,WCol, WButton } from "wt-frontend";
import { ChangeParent_Transaction, ChangeLandmarks_Transaction } from '../../utils/jsTPS';
import { updateAncestorRegions } from '../navbar/NavbarNavigation';

const RegionViewer = (props) => {
    const { currentRegionId } = useParams();
    const [showDelete, toggleShowDelete] 	= useState(false);
    const [editingParentRegion, toggleParentRegionEdit] = useState(false);
    const [currentLandmark, updateLandmark] = useState ("");
    const [input, setInput] = useState({name: ''});
    const [parentRegionInput, setParentRegionInput] = useState({name: ''});
    const [UpdateRegionFieldArray] 	= useMutation(mutations.UPDATE_MAP_FIELD_ARRAY);
	const [UpdateRegionField] 	= useMutation(mutations.UPDATE_MAP_FIELD);

    let region = "";
    let subRegions = [];
    let parentRegion = "";
    let parentRegions = [];
    let ancestorRegions = [];
    let history = useHistory();

    const { loading: loadingR, error: errorR, data: dataR, refetch: refetchR } = useQuery(GET_DB_MAP_BY_ID, {variables: {_id: currentRegionId}});
    if(loadingR) { console.log(loadingR, 'loading'); }
    if(errorR) { console.log(errorR, 'error'); }
    if(dataR) { region = dataR.getMapById; 
    }

	const { loading: loadingS, error: errorS, data: dataS, refetch: refetchS } = useQuery(GET_DB_MAPS, {variables: {_id: currentRegionId}});
	if(loadingS) { console.log(loadingS, 'loading'); }
	if(errorS) { console.log(errorS, 'error'); }
	if(dataS) { subRegions = dataS.getAllMaps; }

    const { loading: loadingP, error: errorP, data: dataP, refetch: refetchP } = useQuery(GET_DB_MAP_BY_ID, {variables: {_id: region.owner}});
    if(loadingP) { console.log(loadingP, 'loading'); }
    if(errorP) { console.log(errorP, 'error'); }
    if(dataP) { parentRegion = dataP.getMapById; 
    }

    const { loading: loadingA, error: errorA, data: dataA, refetch: refetchA } = useQuery(GET_DB_MAPS_ANCESTORS, {variables: {_id: currentRegionId}});
    if(loadingA) { console.log(loadingA, 'loading'); }
    if(errorA) { console.log(errorA, 'error'); }
    if(dataA) { ancestorRegions = dataA.getDBMapAncestors;}

    const { loading, error, data, refetch } = useQuery(GET_DB_MAPS, {variables: {_id: parentRegion.owner}});
    if(loading) { console.log(loading, 'loading'); }
    if(error) { console.log(error, 'error'); }
    if(data) { parentRegions = data.getAllMaps; }

    const HandleParentHistoryRoute = () => {
        history.push("/regions/" + region.owner);
        props.tps.clearAllTransactions()
    }

	const updateInput = (e) => {
		const { name, value } = e.target;
		const updated = { ...input, [name]: value };
		setInput(updated);
	};

    const createNewLandmark = async () =>{
        for (let field in input) {
			if (!input[field]) {
				alert('All fields must be filled out to add Landmark');
				return;
			}
		}
        const originalLandmarks = [...region.landmarks];
        let updatedLandmarks = [...region.landmarks];
        if(!updatedLandmarks.includes(input.name)){
        updatedLandmarks.push(input.name)
        let transaction = new ChangeLandmarks_Transaction(currentRegionId, originalLandmarks, updatedLandmarks, UpdateRegionFieldArray);
		props.tps.addTransaction(transaction);
		await tpsRedo();
        // updateRegionFieldArray(currentRegionId, "landmarks", updatedLandmarks)
        setInput({
            name: ''
          });
        }
        else
            alert('Landmark with same name already exists!');
    }

	const updateParentRegionInput = (e) => {
        const { name, value } = e.target;
		const updated = { ...input, [name]: value };
		setParentRegionInput(updated);
        toggleParentRegionEdit(!editingParentRegion)
	};

    const changeParentRegion = async () =>{
        const originalParentId = region.owner;
        const updatedParent = parentRegions.find(element => element.name === parentRegionInput.name);
        if(!((typeof updatedParent) === 'undefined')){
        const updatedParentId = updatedParent._id
        console.log(originalParentId)
        console.log(updatedParentId)
        let transaction = new ChangeParent_Transaction(currentRegionId, originalParentId, updatedParentId, UpdateRegionField);
		props.tps.addTransaction(transaction);
		await tpsRedo();
        await refetchA();
        }
    }

    const deleteLandmark = async (landmark) => {
        const originalLandmarks = [...region.landmarks];
        let updatedLandmarks = [...region.landmarks]
        const index = updatedLandmarks.indexOf(landmark)
        updatedLandmarks.splice(index, 1)
        let transaction = new ChangeLandmarks_Transaction(currentRegionId, originalLandmarks, updatedLandmarks, UpdateRegionFieldArray);
		props.tps.addTransaction(transaction);
		await tpsRedo();
        // updateRegionFieldArray(currentRegionId, "landmarks", updatedLandmarks)
    }

	const updateRegionFieldArray = async (_id, field, value, prev) => {
		await UpdateRegionFieldArray({ variables: { _id: _id, field: field, value: value }})
        await refetchRegion(refetchR);
	};

	const setShowDelete = (landmark) => {
        setCurrentRegion(landmark);
        toggleShowDelete(!showDelete);
	}

    const setCurrentRegion = (landmark) =>{
        updateLandmark(landmark);
    }

    const tpsUndo = async () => {
		const retVal = await props.tps.undoTransaction();
		await refetchRegion(refetchR);
		await refetchSubRegions(refetchS);
        await refetchParentRegion(refetchP)
        await refetchParentRegions(refetch)
		return retVal;
	}

	const tpsRedo = async () => {
		const retVal = await props.tps.doTransaction();
		await refetchRegion(refetchR);
		await refetchSubRegions(refetchS);
        await refetchParentRegion(refetchP)
        await refetchParentRegions(refetch)
		return retVal;
	}

	const canUndo = () => {
		return props.tps.hasTransactionToUndo();
	  }
	
	const canRedo = () => {
		return props.tps.hasTransactionToRedo();
	  }

    const refetchRegion = async (refetchR) => {
		const { loading, error, data } = await refetchR();
		if (data) {
			region = data.getMapById;
		}
	}

    const refetchSubRegions = async (refetchS) => {
		const { loading, error, data } = await refetchS();
		if (data) {
			subRegions = data.getAllMaps;
		}
	}

    const refetchParentRegion = async (refetchP) => {
		const { loading, error, data } = await refetchP();
		if (data) {
			parentRegion = data.getMapById;
		}
	}

    const refetchParentRegions = async (refetch) => {
		const { loading, error, data } = await refetch();
		if (data) {
			parentRegions = data.getAllMaps;
		}
	}
    const clickDisabled = () => {};

    const undoStyle = canUndo()  ? ' map-table-buttons region-material-icons' : ' map-table-buttons-disabled region-material-icons';
    const redoStyle = canRedo()  ? ' map-table-buttons region-material-icons' : ' map-table-buttons-disabled region-material-icons';

	useEffect(() =>{
        refetchR();
        refetchS();
        refetchP();
        refetch();
	}, []);

    useEffect(() => {
        changeParentRegion(); // using camelCase for variable name is recommended.
      }, [parentRegionInput]);

    return (        
         <div class="centered">
             <WRow style={{ height: "45px", width: "1000px"}}>
             <WCol size="2" >
             <WButton className={`${undoStyle}`} onClick={canUndo() ? () => {tpsUndo()} : () => {clickDisabled()}} ><i className="material-icons" style={{ fontSize: 45}}>undo</i></WButton>
             <WButton className={`${redoStyle}`} onClick={canRedo() ? () => {tpsRedo()} : () => {clickDisabled()}}><i className="material-icons" style={{ fontSize: 45}}>redo</i></WButton></WCol>
             </WRow>
             <WCContent style={{ backgroundColor: "gray", height: "600px", width: "1000px"}}>
             <WRow>
                <WCol size="6">
                <WButton className="map-table-buttons region-material-icons center" ><i className="material-icons" style={{ fontSize: 300}}>flag</i></WButton>
                <WRow>
                <WCol size="5">
                <div className="region-viewer-label-text center">Region Name:</div></WCol>
                <WCol size="6">
                <div className="region-viewer-label-text">{region.name}</div>
                </WCol></WRow>
                <WRow>
                <WCol size="5">
                <div className="region-viewer-label-text center">Parent Region:</div></WCol>
                <WCol size="5">
                    {editingParentRegion ?
                    <form >
                    <label>
                        <select value={parentRegion.name} onChange={(e) => updateParentRegionInput(e)} name="name" autoFocus>
                            {   ((typeof parentRegions) === 'undefined') ?
			                    <></>:
                                parentRegions.map(( region, index) => <option value={region.name} key={index} >{region.name}</option>)
                            }
                        </select>
                    </label>
                    </form>
                    :
                <div className="region-viewer-label-text region-viewer-parent-region" onClick={HandleParentHistoryRoute}> {parentRegion.name}</div>
                    }
                </WCol>
                <WCol size="1"> 
                <WButton className=" region-material-icons" ><i className="material-icons " onClick={() => toggleParentRegionEdit(!editingParentRegion)} >create</i></WButton>
                </WCol>
                </WRow>
                <WRow>
                <WCol size="5">
                <div className="region-viewer-label-text center">Region Capital:</div></WCol>
                <WCol size="6">
                <div className="region-viewer-label-text"> {region.capital}</div>
                </WCol></WRow>
                <WRow>
                <WCol size="5">
                <div className="region-viewer-label-text center">Region Leader:</div></WCol>
                <WCol size="6">
                <div className="region-viewer-label-text"> {region.leader}</div>
                </WCol></WRow>
                <WRow>
                <WCol size="5">
                <div className="region-viewer-label-text center"># of Sub Regions:</div></WCol>
                <WCol size="6">
                <div className="region-viewer-label-text">{subRegions.length}</div>
                </WCol></WRow>
                </WCol>
                <WCol size="6">
                <div className="region-viewer-header-text center">Region Landmarks:</div>
                
                
                { ((typeof region.landmarks) === 'undefined') ?
			        <></>:
                    <div className=' table-entries center' style={{ backgroundColor: "black", height: "420px", width: "460px"}}>
				<RegionViewerTable region={region} subRegions={subRegions} deleteLandmark={setShowDelete} ></RegionViewerTable>
                </div>
			    }
                

                <WCContent className="center" style={{ backgroundColor: "darkgray", height: "33px", width: "460px"}}>
                    <WRow>
                    <WCol size="1">
                    <WButton className="map-table-buttons region-add-button" ><i className="material-icons" style={{ fontSize: 34}} onClick={createNewLandmark}>add_box</i></WButton>
                    </WCol>
                    <WCol size="4">
                    <WCContent className="center" style={{ backgroundColor: "black", height: "33px", width: "220px", backgroundColor: "palevioletred"}}>
                    <WInput className='table-input center' name="name" onChange={updateInput} type='text' wType="outlined" barAnimation="solid" inputClass="table-input-class" value={input.name}/>
                    </WCContent>
                    </WCol>
                    </WRow>
                </WCContent>

                </WCol>
            
             </WRow>
             </WCContent>
            {
				showDelete && (<DeleteLandmarkModal deleteLandmark={deleteLandmark} landmark={currentLandmark} setShowDelete={setShowDelete} />)
			}
        </div>
    );
}

export default RegionViewer;