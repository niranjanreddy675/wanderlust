console.log(coordinates);

const map = new maplibregl.Map({
    container: 'map',
    style: "https://api.jawg.io/styles/jawg-streets.json?access-token=bCEwk7j4Feae2fseJsvnZg9NG37V8owzdTxkD8Ft77DgaeTcBg35SOQbzoVliY6s",
    zoom: 13,
    center: coordinates
});

new maplibregl.Marker()
    .setLngLat(coordinates)
    .addTo(map);