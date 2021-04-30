import { WNavItem, WButton, WRow, WCol } from 'wt-frontend';
import { useHistory } from "react-router-dom";


const MapsTableEntry = (props) => {
    let history = useHistory();

    const HandleHistoryRoute = () => {
        history.push("/regions/" + props._id);
    }

    return (
        <WRow style={{width:"385px", height:"60px"}}>
        <WCol size="8">
        <WNavItem 
            className={"list-item"} hoverAnimation="lighten" style={{width:"275px", height:"60px"}}
        >
            {
                <div className={"list-text"} onClick={() => HandleHistoryRoute()}>
                    {props.name}
                </div>
            }
        </WNavItem>
        </WCol>
        <WCol size="2">
            <div className='button-group'>
                <WButton className="map-table-buttons" >
                    <i className="material-icons" style={{ fontSize: 30 }} onClick={() => props.updateMap(props._id, props.name)} >edit</i>
                </WButton>
                <WButton className="map-table-buttons">
                    <i className="material-icons" style={{ fontSize: 30 }} onClick={() => props.deleteMap(props._id, props.name)} >delete</i>
                </WButton>
                </div>
            </WCol>
        </WRow>
    );
};

export default MapsTableEntry;