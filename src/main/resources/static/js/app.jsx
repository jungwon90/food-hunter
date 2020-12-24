console.log('React Start!');
console.log(ReactRouterDOM);
const Router = ReactRouterDOM.BrowserRouter;
const Route = ReactRouterDOM.Route;
const Switch = ReactRouterDOM.Switch;
const Link = ReactRouterDOM.Link;
const Redirect = ReactRouterDOM.Redirect;

function App() {

    return (
        <Home />
    );
}

function Home(){
    const [data, setData] = React.useState();

    return( 
        <div className="whole-container">
            <div>
                <label>Food Hunters</label>
                <SearchBar setData={setData}/>
            </div>
            <div id="main-container">
                <div id="list-container">

                </div>
                <div id="map-div-container">
                    <MapContainer />
                </div>
                <div id="info-container">

                </div>
            </div>
            <div id="yelp-reviews">

            </div>
        </div>
    );
}

function SearchBar(props){
    const [isError, setIsError] = React.useState(false);
    const [searchInput, setSearchInput] = React.useState('');
    console.log(isError, searchInput);

    const handleSubmit = async event =>{
        event.preventDefault();
        console.log('event handler is working');
        //get the search input from the form
        console.log(isError, searchInput);

        //get request to /search in the server
        $.get('/search', (response)=>{
            console.log(response);
        }).fail(()=>{
            setIsError(true);
            alert('Fail to retrieve the data');
        });
    }

    return(
        <div id="search-bar">
            <form onSubmit={handleSubmit}>
                <input type="text" onChange={(e)=>{
                    e.preventDefault();
                    setSearchInput(e.target.value);
                }} name="search-input" id="search-input" placeholder="What are you craving for?"></input>
                <input type="submit" value="search" id="search-btn"></input>
            </form>
        </div>
    );
}

function MapComponent(props){
    console.log('rendering the map');
    const options = props.options;
    const ref = React.useRef(); //creating Ref object

    React.useEffect(()=>{
        //map creating function
        const createMap = () => props.setMap(new window.google.maps.Map(ref.current, options));

        if(!window.google){ 
            //Create a html element with a script tag in the DOM
            const script = document.createElement('script');
            script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBcPj2Lex4W5AXEhwsPQ02lAG8Axsn2hQg&libraries=places';
            document.head.append(script);
            script.addEventListener('load', createMap);
            console.log('and now there is a map');
            return () => script.removeEventListener('load', createMap);
        } else {
            createMap();
            console.log('and now there is a map');
        }

    }, [options.center.lat]);

    if(props.map){
        console.log('and the map exists');
    } else{ console.log('but there is no map'); }

    return(
        <div id="map-div" 
            style={{ height: props.mapDimensions.height,
            borderRadius: '0.5em',
            width: props.mapDimensions.width, position: 'absolute'}}
            ref={ref}>
        </div>
    );
}

function MapContainer(props){
    //map and map options
    const [map, setMap] = React.useState();
    const [options, setOptions] = React.useState({
        center: {lat: 37.77397, lng: -122.431297},
        zoom: 10
    });

    const mapDimensions = {
        width: '100%',
        height: '100%'
    }

    if (map){
        console.log('hi, there is a map');
    }

    const MainMap = React.useCallback(
        <MapComponent 
            map={map}
            setMap={setMap}
            options={options}
            mapDimensions={mapDimensions}
        />, [options]);
    
    return (
        <div id="map-container">
            {MainMap}
        </div>
    );
}

ReactDOM.render(<App />, document.querySelector('#app'))
