import { WButton, WRow, WCol, WInput } from 'wt-frontend';
import { useHistory } from "react-router-dom";
import React, { useEffect, useState } 	from 'react';
import Regions from './Regions';

const RegionsTableEntry = (props) => {
    const [editingName, toggleNameEdit] = useState(false);
    const [editingCapital, toggleCapitalEdit] = useState(false);
    const [editingLeader, toggleLeaderEdit] = useState(false);
    const history = useHistory();

    const _id = props.region._id;
    const name = props.region.name;
    const capital = props.region.capital;
    const leader = props.region.leader;
    const flag = props.region.flag;

    const flagImage = process.env.PUBLIC_URL + "\\" + flag + " Flag.png";
    const emptyFlagImage = process.env.PUBLIC_URL + "/flag.png";

    let regions = [];
    regions = props.regions;

    if(flag !== props.regionFlag+name){
        props.editFlag(_id, props.regionFlag+name)
    }

    if(props.currentRowEdit.index === props.index){
        if(props.currentRowEdit.field === "name"){
            props.setCurrentRow('', '')
            setTimeout(()=>{toggleNameEdit(true)}, 100)
        }
        else if(props.currentRowEdit.field === "capital"){
            props.setCurrentRow('', '')
            setTimeout(()=>{toggleCapitalEdit(true)}, 100)
        }
        else if(props.currentRowEdit.field === "leader"){
            props.setCurrentRow('', '')
            setTimeout(()=>{toggleLeaderEdit(true)}, 100)
        }

    }

	const checkButtonPressed = (event) => {
		if(event.key === 'ArrowLeft'){
            if(editingCapital === true){
                handleCapitalEdit(event)
                setTimeout(()=>{toggleNameEdit(true)}, 100)
            }
            if(editingLeader === true){
                handleLeaderEdit(event)
                setTimeout(()=>{toggleCapitalEdit(true)}, 100)
            }
        }

        if(event.key === 'ArrowRight')
        {
            if(editingName === true){
                handleNameEdit(event)
                toggleCapitalEdit(true)
            }
            if(editingCapital === true){
                handleCapitalEdit(event)
                toggleLeaderEdit(true)
            }
        }

        if(event.key === 'ArrowUp' && props.index !== 0){
            if(editingName === true){
                handleNameEdit(event)
                props.setCurrentRow(props.index-1, "name")
            }
            if(editingCapital === true){
                handleCapitalEdit(event)
                props.setCurrentRow(props.index-1, "capital")
            }
            if(editingLeader === true){
                handleLeaderEdit(event)
                props.setCurrentRow(props.index-1, "leader")
            }
        }

        if(event.key === 'ArrowDown' && props.index < regions.length - 1){
            if(editingName === true){
                handleNameEdit(event)
                props.setCurrentRow(props.index+1, "name")
            }
            if(editingCapital === true){
                handleCapitalEdit(event)
                props.setCurrentRow(props.index+1, "capital")
            }
            if(editingLeader === true){
                handleLeaderEdit(event)
                props.setCurrentRow(props.index+1, "leader")
            }
        }
	}
    
    const handleNameEdit = (e) => {
        toggleNameEdit(false);
        const newName = e.target.value ? e.target.value : 'Untitled';
        const prevName = name;
        props.editRegion(_id, "name", newName, prevName, flag, props.regionFlag+newName);
    };

    const handleCapitalEdit = (e) => {
        toggleCapitalEdit(false);
        const newCapital = e.target.value ? e.target.value : 'Untitled';
        const prevCapital = capital;
        props.editRegion(_id, "capital", newCapital, prevCapital);
    };

    const handleLeaderEdit = (e) => {
        toggleLeaderEdit(false);
        const newLeader = e.target.value ? e.target.value : 'Untitled';
        const prevLeader = leader;
        props.editRegion(_id, "leader", newLeader, prevLeader);
    };
    
    const HandleSubRegionRoute = () => {
        history.push("/regions/" + _id);
        props.tps.clearAllTransactions()
    }
    
    const HandleRegionViewerRoute = () => {
        history.push("/regionviewer/" + _id);
        props.tps.clearAllTransactions()
    }

    return (
        <WRow style={{ width: "1400px"}}>
            <WCol size="3">
                <WRow>
                {/* <WCol size="1"></WCol> */}
                <WCol size="1"> 
                <WButton className="region-material-icons" onClick={() => props.deleteRegion(props.region)}><i className="material-icons " >close</i></WButton>
                </WCol>
                <WCol size="10">
                {
                 editingName || name === ''
                 ? <WInput
                 className='table-input' onBlur={handleNameEdit}
                 autoFocus={true} defaultValue={name} type='text'
                 wType="outlined" barAnimation="solid" inputClass="table-input-class" onKeyDown={checkButtonPressed}
                 />
                : <div className="table-text center"
                onClick={HandleSubRegionRoute}>{name}</div>
                }
                </WCol>
                <WCol size="1"> 
                <WButton className=" region-material-icons" onClick={() => {toggleNameEdit(!editingName)}}><i className="material-icons " >create</i></WButton>
                </WCol>
                </WRow>
            </WCol>
            <WCol size="2">
                {       
                 editingCapital || capital === ''
                 ? <WInput
                 className='table-input' onBlur={handleCapitalEdit}
                 autoFocus={true} defaultValue={capital} type='text'
                 wType="outlined" barAnimation="solid" inputClass="table-input-class" onKeyDown={checkButtonPressed}
                 />
                : <div className="table-text center"
                onClick={() => toggleCapitalEdit(!editingCapital)}>{capital}</div>
                }
            </WCol>
            <WCol size="2">
            {       
                 editingLeader || leader === ''
                 ? <WInput
                 className='table-input' onBlur={handleLeaderEdit}
                 autoFocus={true} defaultValue={leader} type='text'
                 wType="outlined" barAnimation="solid" inputClass="table-input-class" onKeyDown={checkButtonPressed}
                 />
                : <div className="table-text center"
                onClick={() => toggleLeaderEdit(!editingLeader)}>{leader}</div>
                }
            </WCol>
            <WCol size="2">
                {
                <img className="center-flags" src={flagImage} onError={(e)=>{e.target.onError = null; e.target.src = emptyFlagImage}} width="25%" height="65%"/>
                }
            </WCol>
            <WCol size="3">
                {       <div className="table-text center" onClick={HandleRegionViewerRoute}>No Landmarks</div>
                }
            </WCol>
        </WRow>
    );
};

export default RegionsTableEntry;