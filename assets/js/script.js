const mymap = L.map('mymap').setView([36.49082 , -119.7119], 10);
const attribution = 'Rendered by AGRALOGICS using ESRI & GeoEye Basemaps';
const tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
//'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const tiles = L.tileLayer(tileUrl, {attribution});
tiles.addTo(mymap);

//Draw features
var drawnItems = new L.FeatureGroup();
mymap.addLayer(drawnItems);

var drawControl = new L.Control.Draw({
    draw: {
        position: 'topleft',
        polygon: {
            title: 'Draw a Parcel!',
            allowIntersection: false,
            drawError: {
                color: '#b00b00',
                timeout: 1000
            },
            shapeOptions: {
                color: '#bada55'
            },
            showArea: true
        },
        polyline: false,
        circle: false,
        marker: false,
        circlemarker: false
    },
    edit: {
        featureGroup: drawnItems
    }
});
mymap.addControl(drawControl);

mymap.on('draw:created', function (e) {
    var type = e.layerType,
        layer = e.layer;

    // Do whatever else you need to. (save to db, add to map etc)
    drawnItems.addLayer(layer);
});

// Autocomplete search
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

// Load assets data in side panel
$.ajax({
    type: "GET",
    url: "http://localhost:5000/assets",
    dataType: 'json',
    success: function(assets_data) {   
        console.log(assets_data);
        var $ul = $('#assets');
        debugger
        for (var i = 0; i < assets_data.features.length; i++) {
            var row = '<li>' + assets_data.features[i].properties.name + 
                        '<div class="rside-icon">'+
                            '<a href="#"><i class="fas fa-trash fa-sm p-icon"></i>Del</a>'+
                            '<a href="#"><i class="fas fa-edit  fa-sm p-icon"></i>Edit</a>'+
                        '</div>'+
                    '</li>'
            $ul.append(row);
        }
    }
});

//Load parcles data
$.ajax({
    type: "GET",
    url: "http://localhost:5000/parcels",
    dataType: 'json',
    success: function (parcels_data) {
        geojsonLayer = L.geoJson(parcels_data, {
            // style: yourLeafletStyle
        }).addTo(mymap)
    }
});

