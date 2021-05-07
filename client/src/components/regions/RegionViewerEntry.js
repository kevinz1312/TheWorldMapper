import React, { useEffect, useState } 	from 'react';
import { WRow,WInput,WCol, WButton } from "wt-frontend";

const RegionViewerEntry = (props) => {
    return (
<WRow style={{ width: "440px", height: "45px"}}>
    <WCol size="2">
        {props.subregion ?
        <></>:
        <WButton className="region-material-icons" onClick={() => props.deleteLandmark(props.landmark.landmarks)}><i className="material-icons " >close</i></WButton>
}
    </WCol>
    <WCol size="10">
        {
        props.subregion? 
        <div className="region-viewer-table-text-subregion">{props.landmark.landmarks} - {props.landmark.name} </div>:
        <div className="region-viewer-table-text-region">{props.landmark.landmarks}</div>
        }
        </WCol>
</WRow>
    );
}

export default RegionViewerEntry;