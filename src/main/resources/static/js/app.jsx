console.log('React Start!');
console.log(ReactRouterDOM);
const Router = ReactRouterDOM.BrowserRouter;
const Route = ReactRouterDOM.Route;
const Switch = ReactRouterDOM.Switch;
const Link = ReactRouterDOM.Link;
const Redirect = ReactRouterDOM.Redirect;

function App() {
    console.log('app render');
    return (
        <Home />
    );
}

function Home(props){
    console.log('home render');
    const [data, setData] = React.useState([]);
    const [count, setCount] = React.useState(0);
    const [yelpData, setYelpData] = React.useState();
    console.log(yelpData);

    return( 
        <div className="whole-container">
            <div>
                <label>Food Hunters</label>
                <SearchBar data={data} setData={setData} count={count} setCount={setCount} />
            </div>
            <div id="main-container">
                <div id="list-container">
                    <ListContainer data={data} setYelpData={setYelpData} /> 
                </div>
                <div id="map-div-container">
                    <MapContainer data={data} count={count}/>
                </div>
            </div>
            <div id="yelp-reviews">
                <YelpContainer yelpData={yelpData}/>
            </div>
        </div>
    );
}

function SearchBar(props){
    console.log('search bar render');
    const [isError, setIsError] = React.useState(false);
    const [searchInput, setSearchInput] = React.useState('');
    console.log(isError, searchInput);
    let curCount = props.count;
    console.log(curCount);

    const handleSubmit = async event =>{
        event.preventDefault();
        console.log('event handler is working');
        curCount += 1;
        console.log(curCount);
        props.setCount(curCount);
        console.log(isError, searchInput, props.data);

        //get request to /search in the server
        $.get('/search', (response)=>{
            console.log(response); // a list of objects
            //filter the data based on the searchInput
            const searchData = [];
            let foodItems = '';
            for(const object of response){
                if(object['fooditems']){
                    //convert all the caracters in the string into lowercase
                    foodItems = object['fooditems'].toLowerCase();
                    //if the foodItems includes the searchInput(if it's true)
                    if(foodItems.includes(searchInput)){
                        //push the object into the search data array
                        searchData.push(object);
                    }

                }
            }
            console.log(searchData);
            //set the data to the filtered data from the server
            props.setData(searchData); 

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
                    setSearchInput(e.target.value.toLowerCase());
                }} name="search-input" id="search-input" placeholder="What are you craving for?"></input>
                <input type="submit" value="search" id="search-btn"></input>
            </form>
        </div>
    );
}

function FoodTruck(props){

    const handleClickFoodTruck = async event => {
        event.preventDefault();
        console.log('food truck click event handling is working');
        //get request to yelp with data inputs : /searchInput/truckName
        $.get('/yelp', {'address1': props.address, 'truckName': props.name}, (res)=>{
            console.log(res);
            //update the yelpData
            props.setYelpData(res);

        }).fail(()=>{
            console.log('fail to retrieve the Yelp data');
        })
        
    }

    return(
        <div className="foodTruck" onClick={handleClickFoodTruck}>
            <img src={props.imgUrl} className="list-truck-icon"></img>
            <div className="foodtruck-list-info">
                <p>{props.name}</p>
                <p>{props.address}</p>
            </div>
        </div>
    );
}

function ListContainer(props){
    console.log('listContainer render');
    const listData = props.data;
    let imgUrl = '../img/foodtruck-icon.png';
    //an empty list to contain a list of food trucks
    const foodTruckLists = [];
    
    if(listData.length !== 0){
        console.log('useEffect is working');
        for(let i = 0; i < listData.length; i++){
            foodTruckLists.push(<FoodTruck 
            key={i}
            imgUrl={imgUrl}
            name={listData[i].applicant}
            address={listData[i].address}
            setYelpData={props.setYelpData}/>)
        }
    }

    return(
        <div className="list-scrollbar">
            {foodTruckLists}
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
    console.log('map container render')
    //map and map options
    const [map, setMap] = React.useState();
    const [options, setOptions] = React.useState({
        center: {lat: 37.77397, lng: -122.431297},
        zoom: 10
    });
    const [markers, setMarkers] = React.useState([]);

    const mapDimensions = {
        width: '100%',
        height: '100%'
    }

    if (map){
        console.log('hi, there is a map');
        console.log(markers);
        console.log(props.count);
        let curMarkers = [];
        
        if(props.count > 1 && props.data.length !== markers.length){
            console.log('deleting previous markers');
            //delete the previous markers
            for(const marker of markers){
                marker.setMap(null);
            }
        }
        
        //creating markers at first search
        if((props.data.length !== 0 && markers.length === curMarkers.length)||
            (props.count > 1 && props.data.length !== markers.length)){
            console.log(props.data);
            
            //create markers with an Info container
            for(const truck of props.data){
                const truckInfo = new google.maps.InfoWindow();
                const truckInfoContent = (`
                    <div class="window-content">
                        <ul class="truck-info">
                            <li><b>Address: </b>${truck['address']}</li>
                            <li><b>Name: </b>${truck['applicant']}</li>
                            <li><b>Food Items: </b>${truck['fooditems']}</li>
                        </ul>
                    </div>
                `);

                const truckMarker = new window.google.maps.Marker({
                    position: {lat: parseFloat(truck['latitude']), lng: parseFloat(truck['longitude'])},
                    title: `${truck['applicant']}`,
                    map: map
                });

                curMarkers.push(truckMarker);
                
                truckMarker.addListener('click', ()=>{
                    truckInfo.close();
                    truckInfo.setContent(truckInfoContent);
                    truckInfo.open(map, truckMarker);
                });
            }
            console.log(curMarkers);
            setMarkers(curMarkers);
        } 

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

function YelpContainer(props){
    const yelpData = props.yelpData;
    
    if(yelpData){
        let rating = yelpData['rating'];
        let open = yelpData.is_closed ? 'closed' : 'open';
        let hours = yelpData['hours'][0];
        
        let categories = [];
        for(const category of yelpData.categories){
            categories.push(category['title']);
        }

        let services = [];
        for(const service of yelpData['transactions']){
            services.push(service);
        }

        let address = [];
        for(const arrAdd of yelpData['location']['display_address']){
            address.push(arrAdd);
        }
        
        const content = `
        <div class="yelp-content-box" style="background-image:linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${yelpData['image_url']});">
            <p>${yelpData['name']}</p>
            <img class="rating-img" src="../img/${rating}stars.png">
        </div>
        <div class="yelp-content-box">
            <p>${categories.join(', ')}</p>
            <p>${open}</p>
            <p>Call   ${yelpData['display_phone']}</p>
            <div>Services: ${services.join(' & ')}</div>
            <a href=${yelpData['url']}>View More Info in Yelp</a>
        </div>
        <div class="yelp-content-box">
            <div>
                <label>ADDRESS</label>
                <p>${address.join(', ')}</p>
            </div>
            <div>
                <label>HOURS</label>
                <p></p>
            </div>
        </div>`;

        $('#yelp-content').append(content);
    } 

    return(
        <div id="yelp-content">
        </div>
    );
}

ReactDOM.render(<App />, document.querySelector('#app'))
