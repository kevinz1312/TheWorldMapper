import React, { useEffect, useState } 	from 'react';
import { WRow,WInput,WCol, WButton } from "wt-frontend";

const RegionViewerEntry = (props) => {
    const [editingName, toggleNameEdit] = useState(false);

    const handleNameEdit = (e) => {
        toggleNameEdit(false);
        const newName = e.target.value;
        const oldName = props.landmark.landmarks;
        if(newName !== oldName){
            props.updateLandmarkName(oldName, newName)
        }
    }


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
        
        editingName?
        
        <WInput
                 className='table-input' onBlur={handleNameEdit}
                 autoFocus={true} defaultValue={props.landmark.landmarks} type='text'
                 wType="outlined" barAnimation="solid" inputClass="table-input-class"
                 />
        :

        <div className="region-viewer-table-text-region" onClick={()=>{toggleNameEdit(true);}}>{props.landmark.landmarks}</div>
        }
        </WCol>
</WRow>
    );
}

export default RegionViewerEntry;