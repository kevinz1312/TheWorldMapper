import RegionsTableEntry   from './RegionsTableEntry';

const RegionsTable = (props) => {
    return (
        <div className=' table-entries container-primary'>
            {
                // props.todolists &&
                props.regions.map((region, index) => (
                    <RegionsTableEntry
                        id={region.id} key={region._id} 
                        region={region} editRegion={props.editRegion} deleteRegion={props.deleteRegion}

                        />
                ))
            }
        </div>
    );
};

export default RegionsTable;