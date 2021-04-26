import { WNavItem, WMHeader, WMMain, WMFooter, WButton, WInput, WRow, WCol } from 'wt-frontend';


const MapsTableEntry = (props) => {
    return (
        <WRow style={{width:"385px", height:"60px"}}>
        <WCol size="8">
        <WNavItem 
            className={"list-item"} hoverAnimation="lighten" style={{width:"275px", height:"60px"}}
        >
            {
                <div className={"list-text"}>
                    {props.name}
                </div>
            }
        </WNavItem>
        </WCol>
        <WCol size="2">
            <div className='button-group'>
                <WButton className="map-table-buttons" >
                    <i className="material-icons" style={{ fontSize: 30 }}>edit</i>
                </WButton>
                <WButton className="map-table-buttons">
                    <i className="material-icons" style={{ fontSize: 30 }}>delete</i>
                </WButton>
                </div>
            </WCol>
        </WRow>
    );
};

export default MapsTableEntry;