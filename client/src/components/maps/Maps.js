import { WRow } from "wt-frontend";
import WButton from "wt-frontend/build/components/wbutton/WButton";
import WCContent from "wt-frontend/build/components/wcard/WCContent";
import WCHeader from "wt-frontend/build/components/wcard/WCHeader";
import WCol from "wt-frontend/build/components/wgrid/WCol";
import globe from '../../images/globe.png';
import MapsTable from "./MapsTable";

const Maps = (props) => {


    
    return (
         <div class="centered">
             <WCHeader style={{ backgroundColor: "red", height: "25px", width: "800px" }} class="maps-header-text center">Your Maps</WCHeader>
             <WCHeader style={{ backgroundColor: "black", height: "60px", width: "800px"}} class="center">Your Maps</WCHeader>
             <WCContent style={{ backgroundColor: "lightpink", height: "400px"}}>
                <WRow>
                    <WCol size="6">
                        <MapsTable/>
                    </WCol>
                    <WCol size="6" style={{backgroundColor: "white"}}>
                    <img src={globe} style={{height:"361px"}} class="center"/>
                    <WButton className="modal-button" span clickAnimation="ripple-light" hoverAnimation="darken" shape="default" color="danger">
						Create New Map
					</WButton>
                    </WCol>
                </WRow>

             </WCContent>
        </div>
    );
}

export default Maps;