const mymap = L.map('assetMap').setView([36.49082 , -119.7119], 10);
			const attribution = 'Rendered by AGRALOGICS using ESRI & GeoEye Basemaps';
			const tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
			//'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
			const tiles = L.tileLayer(tileUrl, {attribution});
			tiles.addTo(mymap);