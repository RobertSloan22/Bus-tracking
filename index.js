<script>
    mapboxgl.accessToken = 'pk.eyJ1Ijoicm9iZXJ0LXNyeC0yMDIzIiwiYSI6ImNsZjRod2IzOTBzOXE0NHBqcXlxcm1mOWkifQ.J7-wF778aBOY0gM4BQystw';
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/robert-srx-2023/clf4jcmgy001g01orkytoeyw7',
        center: [-71.091542, 42.358862], // Boston, MA
        zoom: 12
    });

    var mbtaApiKey = '3424bea4b8664496bd692e5b6d85bf45';
    var mbtaUrl = 'https://api-v3.mbta.com/vehicles?filter[route]=1&include=trip';

    // create a marker for each bus location returned by the API
    async function createMarkers(busLocations) {
        busLocations.forEach(function(busLocation) {
            var markerEl = document.createElement('div');
            markerEl.className = 'bus-marker';

            new mapboxgl.Marker(markerEl)
                .setLngLat([busLocation.attributes.longitude, busLocation.attributes.latitude])
                .addTo(map);
        });
    }

    // retrieve the bus locations from the MBTA API and create markers on the map
   async function updateBusLocations() {
        fetch(mbtaUrl, {
            headers: { 'x-api-key': mbtaApiKey }
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            var busLocations = data.data;
            createMarkers(busLocations);
        });
    }

    // update the bus locations every 15 seconds
    setInterval(updateBusLocations, 15000);
    run();
</script>
<script>

var map;
var markers = [];

// load map
function init(){
var myOptions = {
    zoom      : 14,
    center    : { lat:42.353350,lng:-71.091525},
    mapTypeId : google.maps.MapTypeId.ROADMAP
};
var element = document.getElementById('map');
  map = new google.maps.Map(element, myOptions);
  addMarkers();
}

// Add bus markers to map
async function addMarkers(){
// get bus data
var locations = await getBusLocations();

// loop through data, add bus markers
locations.forEach(function(bus){
    var marker = getMarker(bus.id);		
    if (marker){
        moveMarker(marker,bus);
    }
    else{
        addMarker(bus);			
    }
});

// timer
console.log(new Date());
setTimeout(addMarkers,15000);
}

// Request bus data from MBTA
//https://api-v3.mbta.com/vehicles?filter[route]=1&include=trip
async function getBusLocations(){
var url = 'https://api-v3.mbta.com/vehicles?api_key=eyJ1Ijoicm9iZXJ0LXNyeC0yMDIzIiwiYSI6ImNsZjRod2IzOTBzOXE0NHBqcXlxcm1mOWkifQ.J7-wF778aBOY0gM4BQystw';	
var response = await fetch(url);
var json     = await response.json();
return json.data;
}

function addMarker(bus){
var icon = getIcon(bus);
var marker = new google.maps.Marker({
    position: {
        lat: bus.attributes.latitude, 
        lng: bus.attributes.longitude
    },
    map: map,
    icon: icon,
    id: bus.id
});
markers.push(marker);
}

function getIcon(bus){
// select icon based on bus direction
if (bus.attributes.direction_id === 0) {
    return 'red.png';
}
return 'blue.png';	
}

function moveMarker(marker,bus) {
// change icon if bus has changed direction
var icon = getIcon(bus);
marker.setIcon(icon);

// move icon to new lat/lon
marker.setPosition( {
    lat: bus.attributes.latitude, 
    lng: bus.attributes.longitude
});
}

function getMarker(id){
var marker = markers.find(function(item){
    return item.id === id;
});
return marker;
}

window.onload = init;
</script>
