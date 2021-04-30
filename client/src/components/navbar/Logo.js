import React from 'react';
import { useHistory } from "react-router-dom";

const Logo = (props) => {
    let history = useHistory();

    const HandleHistoryRoute = () => {
        history.push("/welcome");
    }

    return (
        <div className='logo' onClick={HandleHistoryRoute}>
            The World Data Mapper
        </div>
    );
};

export default Logo;