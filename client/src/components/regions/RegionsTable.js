import RegionsTableEntry   from './RegionsTableEntry';
import { useMutation, useQuery } 		from '@apollo/client';
import DeleteRegionModal 							from '../modals/DeleteRegionModal';
import React, {useState } 	from 'react';

const RegionsTable = (props) => {
    const [showDelete, toggleShowDelete] 	= useState(false);
    const [currentRegion, updateRegion] = useState ("");

	const setShowDelete = (region) => {
        setCurrentRegion(region);
        toggleShowDelete(!showDelete);
	}

    const setCurrentRegion = (region) =>{
        updateRegion(region);
    }
    return (
        <div className=' table-entries container-primary'>
            {
                // props.todolists &&
                props.regions.map((region, index) => (
                    <RegionsTableEntry
                        id={region.id} key={region._id} 
                        region={region} editRegion={props.editRegion} deleteRegion={setShowDelete}
                        tps={props.tps} regionFlag={props.regionFlag} editFlag={props.editFlag}
                        />
                ))
            }
            {
				showDelete && (<DeleteRegionModal deleteRegion={props.deleteRegion} region={currentRegion} setShowDelete={setShowDelete} />)
			}
        </div>
    );
};

export default RegionsTable;