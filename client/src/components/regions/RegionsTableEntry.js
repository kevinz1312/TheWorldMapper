import { WNavItem, WButton, WRow, WCol } from 'wt-frontend';
import { useHistory } from "react-router-dom";


const RegionsTableEntry = (props) => {
    let history = useHistory();

    const HandleHistoryRoute = () => {
        history.push("/regions/" + props._id);
    }
    
    return (
        <WRow style={{ width: "1400px"}}>
            <WCol size="2">
                {       <div className="table-text center" onClick={HandleHistoryRoute}>{props.name}</div>
                }
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
        </WRow>
    );
};

export default RegionsTableEntry;