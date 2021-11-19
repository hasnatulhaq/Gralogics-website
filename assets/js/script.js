const mymap = L.map('mymap').setView([36.49082 , -119.7119], 10);
const attribution = 'Rendered by AGRALOGICS using ESRI & GeoEye Basemaps';
const tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
//'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const tiles = L.tileLayer(tileUrl, {attribution});
tiles.addTo(mymap);

$(function() {
    $("#searchBox").autocomplete({
        source : function(request, response) {
            $.ajax({
                type: "GET",
                url : "http://localhost:5000/autocomplete",
                dataType : "json",
                cache: false,
                data: {
                    input: searchBox.value
                },
                success: function(data) {
                    response(data);
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log(textStatus + " " + errorThrown);
                },
            });
        },
        select: function( event, ui ) {
            $.ajax({
                type: "GET",
                url: "http://localhost:5000/parcels",
                dataType: 'json',
                data: {
                    apn: ui.item.value
                },
                success: function (response) {
                    var feature = L.geoJson(response)
                    mymap.fitBounds(feature.getBounds());
                }
            });
        },
        minLength : 2
    });
    
});

$.ajax({
    type: "GET",
    url: "http://localhost:5000/parcels",
    dataType: 'json',
    success: function (response) {
        geojsonLayer = L.geoJson(response, {
            // style: yourLeafletStyle
        }).addTo(mymap)
    }
});