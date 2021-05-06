import React, { useEffect, useState } 	from 'react';
import { WRow,WCHeader,WCol, WButton } from "wt-frontend";
import { useMutation, useQuery } 		from '@apollo/client';
import { GET_DB_MAP_BY_ID } 				from '../../cache/queries';

const RegionsHeader = (props) => {
    let region = "";

    const { loading, error, data, refetch } = useQuery(GET_DB_MAP_BY_ID, {variables: {_id: props.currentRegionId}});
    if(loading) { console.log(loading, 'loading'); }
    if(error) { console.log(error, 'error'); }
    if(data) { region = data.getMapById; }

    const active = props.regions.length > 0

    const undoStyle = props.canUndo  ? ' map-table-buttons region-material-icons' : ' map-table-buttons-disabled region-material-icons';
    const redoStyle = props.canRedo  ? ' map-table-buttons region-material-icons' : ' map-table-buttons-disabled region-material-icons';
    const activeClass = active ? ' table-header-section-sort' : ''
    const clickDisabled = () => {};

    useEffect(() =>{
		refetch();
	}, []);

    return (
         <div>
             <WRow style={{ height: "35px", width: "1400px"}}>
             <WCol size="2" >
             <WButton className="map-table-buttons region-add-button" ><i className="material-icons" style={{ fontSize: 35}} onClick={props.createNewRegion}>add_box</i></WButton>
             <WButton className={`${undoStyle}`} onClick={props.canUndo ? props.undo : clickDisabled}><i className="material-icons" style={{ fontSize: 35}}>undo</i></WButton>
             <WButton className={`${redoStyle}`} onClick={props.canRedo ? props.redo : clickDisabled}><i className="material-icons" style={{ fontSize: 35}}>redo</i></WButton></WCol>
             <WCol size="2"></WCol>
             <WCol size="2"><WCHeader class="maps-header-text center">Region Name:</WCHeader>
             </WCol>
             <WCol size="6" style={{ height: "35px", width: "400px"}}><WCHeader class="maps-header-name-text" >{region.name}</WCHeader> </WCol>
             </WRow>
             <WRow style={{ height: "8px", width: "1400px"}}></WRow> 
             <WRow style={{ height: "50px", width: "1400px", background: "red"}}>
             <WCol size="3"><WButton className={`table-header-section ${activeClass} center`} wType="texted" onClick={() => active ? props.sortRegions("name") : clickDisabled}>Name</WButton></WCol>
             <WCol size="2"><WButton className={`table-header-section ${activeClass} center`} wType="texted" onClick={() => active ? props.sortRegions("capital") : clickDisabled}>Capital</WButton></WCol>
             <WCol size="2"><WButton className={`table-header-section ${activeClass} center`} wType="texted" onClick={() => active ? props.sortRegions("leader") : clickDisabled}>Leader</WButton></WCol>
             <WCol size="2"><WButton className='table-header-section center' wType="texted" >Flag</WButton></WCol>
             <WCol size="3"><WButton className='table-header-section center' wType="texted" >Landmarks</WButton></WCol>

             </WRow>        
        </div>
    );
}

export default RegionsHeader;