<script>



async function run() {
    const locations = await getBusLocation();
    console.log(new Date);
    console.log(locations);


    setTimeout(run, 1500);
}


async function getBusLocation() {
    const url = 'https://api-v3.mbta.com/vehicles?filter[route]=1&include=trip';
    const response = await fetch(url);
    const json = await response.json();
    return json.data;
}

run();








</script>