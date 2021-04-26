import { WRow } from "wt-frontend";
import WButton from "wt-frontend/build/components/wbutton/WButton";
import WCContent from "wt-frontend/build/components/wcard/WCContent";
import WCHeader from "wt-frontend/build/components/wcard/WCHeader";
import WCol from "wt-frontend/build/components/wgrid/WCol";
import globe from '../../images/globe.png';
import MapsTable from "./MapsTable";
import React, { useState } 	from 'react';
import * as mutations 					from '../../cache/mutations';
import { useMutation, useQuery } 		from '@apollo/client';
import { GET_DB_MAPS } 				from '../../cache/queries';
import CreateMap 							from '../modals/CreateMap';

const Maps = (props) => {
    let maps 							= [];
	const [AddMap] 			= useMutation(mutations.ADD_MAP);
	const [showCreate, toggleShowCreate] 	= useState(false);

	const { loading, error, data, refetch } = useQuery(GET_DB_MAPS);
	if(loading) { console.log(loading, 'loading'); }
	if(error) { console.log(error, 'error'); }
	if(data) { maps = data.getAllMaps; }

	const createNewMap = async (name) => {
		const length = maps.length
		const id = length >= 1 ? maps[length - 1].id + Math.floor((Math.random() * 100) + 1) : 1;
		let list = {
			_id: '',
			id: id,
			name: name,
			owner: props.user._id,
		}
		const { data } = await AddMap({ variables: { map: list }});
		list._id = data;
		await refetchMaps(refetch);
	}


    const refetchMaps = async (refetch) => {
		const { loading, error, data } = await refetch();
		if (data) {
			maps = data.getAllMaps;
		}
	}

	const setShowCreate = () => {
		toggleShowCreate(!showCreate);
	};

    return (
         <div class="centered">
             <WCHeader style={{ backgroundColor: "red", height: "25px", width: "800px" }} class="maps-header-text center">Your Maps</WCHeader>
             <WCHeader style={{ backgroundColor: "black", height: "60px", width: "800px"}} class="center">Your Maps</WCHeader>
             <WCContent style={{ backgroundColor: "lightpink", height: "400px"}}>
                <WRow>
                    <WCol size="6" style={{height:"400px"}}>
                        <MapsTable maps={maps}/>
                    </WCol>
                    <WCol size="6" style={{backgroundColor: "white", height: "400px"}}>
                    <img src={globe} style={{height:"363px"}} class="center"/>
                    <WButton className="modal-button" span clickAnimation="ripple-light" hoverAnimation="darken" shape="default" color="danger" onClick={setShowCreate}>
						Create New Map
					</WButton>
                    </WCol>
                </WRow>
             </WCContent>
             {
				showCreate && (<CreateMap createNewMap={createNewMap} setShowCreate={setShowCreate} />)
			}
        </div>
    );
}

export default Maps;