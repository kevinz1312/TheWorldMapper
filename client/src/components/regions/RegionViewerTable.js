import React, { useEffect, useState } 	from 'react';
import RegionViewerEntry from "./RegionViewerEntry";
import * as mutations 					from '../../cache/mutations';
import { useMutation, useQuery } 		from '@apollo/client';
import { GET_DB_MAP_BY_ID } 				from '../../cache/queries';
import { GET_DB_MAPS } 				from '../../cache/queries';
import WCContent from "wt-frontend/build/components/wcard/WCContent";
import { useHistory } from "react-router-dom";
import { WRow,WInput,WCol, WButton } from "wt-frontend";

const RegionViewerTable = (props) => {
    let totalLandmarks = [];

    for(let i =0; i < props.region.landmarks.length; i++){
        let tempItem ={
            name: "",
            landmarks: props.region.landmarks[i]
        }
        totalLandmarks.push(tempItem)
    }

    for(let i =0; i < props.subRegions.length; i++){
        if(props.subRegions[i].landmarks.length > 0){
        let tempItem ={
            name: props.subRegions[i].name,
            landmarks: props.subRegions[i].landmarks
        }
        totalLandmarks.push(tempItem)
        }
    }

    totalLandmarks.sort((a, b) => (a.landmarks > b.landmarks) ? 1 : -1)

    return (
        <div>
            
            {
                        totalLandmarks.map((landmark, index) => (
                            props.region.landmarks.includes(landmark.landmarks) ?
                            <RegionViewerEntry
                            landmark={landmark} subregion={false} deleteLandmark={props.deleteLandmark}
                            key={index} updateLandmarkName={props.updateLandmarkName}
                            /> :
                            <RegionViewerEntry
                            landmark={landmark} subregion={true} deleteLandmark={props.deleteLandmark}
                            key={index} updateLandmarkName={props.updateLandmarkName}
                            />
                            ))
                        
                        }

        
        </div>
    );
}

export default RegionViewerTable;