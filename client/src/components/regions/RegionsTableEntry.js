import { WButton, WRow, WCol } from 'wt-frontend';
import { useHistory } from "react-router-dom";


const RegionsTableEntry = (props) => {
    let history = useHistory();

    const HandleSubRegionRoute = () => {
        history.push("/regions/" + props._id);
    }
    
    const HandleRegionViewerRoute = () => {
        history.push("/regionviewer/" + props._id);
    }

    return (
        <WRow style={{ width: "1400px"}}>
            <WCol size="3">
                <WRow>
                <WCol size="1"></WCol>
                <WCol size="1"> 
                <WButton className="map-table-buttons region-material-icons"><i className="material-icons " >close</i></WButton>
                </WCol>
                <WCol size="6">
                {       
                <div className="table-text center" onClick={HandleSubRegionRoute}>{props.name}</div>
                }
                </WCol>
                </WRow>
            </WCol>
            <WCol size="2">
                {       <div className="table-text center">{props.capital}</div>
                }
            </WCol>
            <WCol size="2">
                {       <div className="table-text center">{props.leader}</div>
                }
            </WCol>
            <WCol size="2">
                {       <div className="table-text center">{props.flag}</div>
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