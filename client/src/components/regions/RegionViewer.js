import React, { useEffect, useState } 	from 'react';
import {useParams} from "react-router-dom";
import RegionsHeader from "./RegionsHeader";
import * as mutations 					from '../../cache/mutations';
import { useMutation, useQuery } 		from '@apollo/client';
import { GET_DB_MAP_BY_ID } 				from '../../cache/queries';
import { GET_DB_MAPS } 				from '../../cache/queries';
import WCContent from "wt-frontend/build/components/wcard/WCContent";
import { useHistory } from "react-router-dom";
import { WRow,WCHeader,WCol, WButton } from "wt-frontend";

const RegionViewer = (props) => {
    const { currentRegionId } = useParams();
    let region = "";
    let subRegions = [];
    let parentRegion = "";
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

    const { loading, error, data, refetch } = useQuery(GET_DB_MAP_BY_ID, {variables: {_id: region.owner}});
    if(loading) { console.log(loading, 'loading'); }
    if(error) { console.log(error, 'error'); }
    if(data) { parentRegion = data.getMapById; }
    
    const HandleParentHistoryRoute = () => {
        history.push("/regions/" + region.owner);
    }

	useEffect(() =>{
        refetch();
	}, []);

    return (
         <div class="centered">
             <WRow style={{ height: "45px", width: "1000px", background: "red"}}>
             <WCol size="2" >
             <WButton className="map-table-buttons region-material-icons" ><i className="material-icons" style={{ fontSize: 45}}>undo</i></WButton>
             <WButton className="map-table-buttons region-material-icons"><i className="material-icons" style={{ fontSize: 45}}>redo</i></WButton></WCol>
             </WRow>
             <WCContent style={{ backgroundColor: "lightpink", height: "600px", width: "1000px"}}>
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
                <WCol size="6">
                <div className="region-viewer-label-text region-viewer-parent-region" onClick={HandleParentHistoryRoute}> {parentRegion.name}</div>
                </WCol></WRow>
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

                


             </WRow>
             </WCContent>

        </div>
    );
}

export default RegionViewer;