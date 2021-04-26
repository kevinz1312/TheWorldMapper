import MapsTableEntry   from './MapsTableEntry';

const MapsTable = (props) => {
    const handleDeleteMap = (_id, name) =>{
        props.setCurrentMapId(_id);
        props.setCurrentMapName(name);
        props.setShowDelete();
    }

    const handleUpdateMap = (_id, name) =>{
        props.setCurrentMapId(_id);
        props.setCurrentMapName(name);
        props.setShowUpdate();
    }
    return (
        <div className=' table-entries container-primary'>
            {
                // props.todolists &&
                props.maps.map(map => (
                    <MapsTableEntry
                        deleteMap={handleDeleteMap} updateMap={handleUpdateMap} id={map.id} key={map.id} name={map.name} _id={map._id} 
                    />
                ))
            }
        </div>
    );
};

export default MapsTable;