import { WNavItem} from 'wt-frontend';
import { useHistory } from "react-router-dom";

const NavbarNavigationEntry = (props) => {
    let history = useHistory();

    const HandleSubRegionRoute = () => {
        history.push("/regions/" + props._id);
    }
    
    return (
            props.owner === props.user_id ?
            
                <WNavItem hoverAnimation="lighten">
                    <div className="navbar-navigation" onClick={HandleSubRegionRoute}>
                        {props.name}
                    </div>
                </WNavItem>
            
            :
            <>

            <div><i className="material-icons" style={{ fontSize: 35}}>chevron_right</i></div>
            <WNavItem hoverAnimation="lighten">
            <div className="navbar-navigation" onClick={HandleSubRegionRoute}>
                        {props.name}
            </div>
            </WNavItem>
            </>

    );
};

export default NavbarNavigationEntry;