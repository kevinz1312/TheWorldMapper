import MapsTableEntry   from './MapsTableEntry';

const MapsTable = (props) => {

    return (
        <div className=' table-entries container-primary'>
            {
                // props.todolists &&
                props.maps.map(map => (
                    <MapsTableEntry
                        id={map.id} key={map.id} name={map.name} _id={map._id}
                    />
                ))
            }
        </div>
    );
};

export default MapsTable;