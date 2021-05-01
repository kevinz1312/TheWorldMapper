import RegionsTableEntry   from './RegionsTableEntry';

const RegionsTable = (props) => {
    return (
        <div className=' table-entries container-primary'>
            {
                // props.todolists &&
                props.regions.map(region => (
                    <RegionsTableEntry
                        id={region.id} key={region.id} name={region.name} _id={region._id} capital={region.capital} leader={region.leader} flag={region.flag} landmarks={region.landmarks}
                    />
                ))
            }
        </div>
    );
};

export default RegionsTable;