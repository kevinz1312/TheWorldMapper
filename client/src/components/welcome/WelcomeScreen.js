import globe from '../../images/globe.png';
const WelcomeScreen = (props) => {

    return (
        <div class="center">
        <img src={globe}/>
        <div class="welcome-text">Welcome To The World Data Mapper</div>
        </div>
    );
}

export default WelcomeScreen;