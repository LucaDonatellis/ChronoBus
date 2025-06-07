import 'leaflet/dist/leaflet.css';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

export class Map {
    constructor(mapElement) {
        this.L = undefined;
        this.ControlGeocoder = undefined;
        this.Routing = undefined;
        this.userLatLon = undefined;
        this.searchLatLng = undefined;
        this.mapElement = mapElement;

        this.map = undefined;
    }
    async init() {
        this.L = await import('leaflet');
        this.ControlGeocoder = (await import('leaflet-control-geocoder')).default;
        this.Routing = (await import('leaflet-routing-machine')).default;

        this.map = this.L.map(this.mapElement, {
            zoomControl: false
        }).setView([46.04, 11.13], 13);

        this.L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(this.map);

        this.map.locate({ setView: false, maxZoom: 15 });

        this.drawUserLocation();
        this.searchBar();
    }
    drawUserLocation() {
        if (!navigator.geolocation) { alert("GPS error"); return; }

        let accuracyCircle = null;
        let userCircle = null;

        navigator.geolocation.watchPosition(
            (pos) => {
                const accuracy = pos.coords.accuracy;

                this.userLatLon = [pos.coords.latitude, pos.coords.longitude];

                if (!accuracyCircle) {
                    accuracyCircle = this.L.circle(this.userLatLon, { radius: accuracy, weight: 2 }).addTo(this.map);
                    userCircle = this.L.circleMarker(this.userLatLon, {
                        fill: true,
                        color: '#ffffff',
                        fillOpacity: 1,
                        weight: 2,
                        fillColor: '#0045ff',
                        radius: 8
                    }).addTo(this.map);
                    this.map.setView(this.userLatLon, 15);
                } else {
                    accuracyCircle.setLatLng(this.userLatLon);
                    userCircle.setLatLng(this.userLatLon);
                    accuracyCircle.setRadius(accuracy);
                }
            },
            (err) => {
                console.error('Geolocalization error:', err.message);
            },
            {
                enableHighAccuracy: true,
                maximumAge: 10000,
                timeout: 10000
            }
        );
    }
    addMarker(coords, iconUrl) {
        let icon = this.L.icon({
            iconUrl: iconUrl,
            iconSize: [25, 25],
            iconAnchor: [12.5, 25],
            popupAnchor: [0, -25]
        });

        this.L.marker(coords, { icon: icon }).addTo(this.map);
    }

    addBusStop(coords, stopName, lines, iconColor) {
        const svgIcon = `
		<svg xmlns="http://www.w3.org/2000/svg" fill=${iconColor} viewBox="0 0 512 489.437" width="30" height="30" clip-rule="evenodd" fill-rule="evenodd" image-rendering="optimizeQuality" text-rendering="geometricPrecision" shape-rendering="geometricPrecision">

 <g>
  <title>Layer 1</title>
  <path stroke="null" id="svg_1" d="m267.82655,486.65162c-3.57012,2.60269 -8.41644,2.96176 
  -12.39252,0.40939c-42.89524,-27.28481 -78.95442,-60.08376 -107.26041,-95.68323c-39.06897,-49.01317 -63.70535,-103.38382 -72.11835,-155.71439c-8.56967,
  -53.09217 -0.56376,-104.14656 25.85768,-145.66498c10.40391,-16.42235 23.71469,-31.3661 39.93577,-44.27206c37.28276,-29.73427 79.86925,-45.39044 122.25333,
  -45.08512c40.85517,0.30647 81.14658,15.55326 115.98103,47.33103c12.24386,11.11862 22.54599,23.86906 30.96128,37.691c28.40891,46.76841 34.52912,106.44507 
  22.03483,166.93593c-19.49389,94.71695 -82.07399,183.56182 -165.25264,234.05245zm50.63356,-238.10171l-8.55366,0l0,13.4663c0,5.2637 -4.30428,9.58056
   -9.58285,9.58056l-5.63078,0c-5.2637,0 -9.58285,-4.31686 -9.58285,-9.58056l0,-13.4663l-57.99795,0l0,13.4663c0,5.2637 -4.31686,9.58056 -9.5817,9.58056l-5.63192,0c-5.2637,0 -9.58056,-4.31686 -9.58056,-9.58056l0,-13.4663l-7.29348,0c-4.99612,-0.0789 -7.39412,-2.75936 -7.76348,-7.46845l0,-109.91571c-2.77994,0.28017 -4.16476,0.92741 -4.84174,2.37627l0,31.41756l-6.07447,0c-3.78054,0 -6.87838,-3.09441 -6.87838,-6.87724l0,-18.55962c0,-3.71993 2.99035,-6.77432 6.68741,-6.87609c0.5752,-5.40093 2.89887,-6.96071 11.2993,-7.36667c1.1584,-9.41703 7.55535,-16.38804 19.24345,-20.88329c25.03776,-4.59359 72.55518,-5.07502 99.08755,0c11.69839,4.50554 18.08505,11.46625 19.24117,20.889c8.41415,0.42883 10.73896,2.00805 11.31188,7.36095c3.6902,0.10978 6.67597,3.15959 6.67597,6.87609l0,18.55962c0,3.78282 -3.09899,6.87724 -6.87952,6.87724l-6.07447,0l0,-31.51018c-0.6804,-1.4157 -2.06866,-2.03778 -4.83945,-2.29737l0,108.85565c-0.00114,6.30775 -2.03207,8.54909 -6.75945,8.54223zm-75.99609,-15.57155l27.5524,0c0.74216,0 1.34937,0.60608 1.34937,1.34937l0,4.61074c0,0.7433 -0.60722,1.34937 -1.34937,1.34937l-27.5524,0c-0.74216,0 -1.34937,-0.60608 -1.34937,-1.34937l0,-4.61074c0,-0.7433 0.60722,-1.34937 1.34937,-1.34937zm78.1082,-12.23585l-0.40253,-9.53024c-0.21956,-1.67986 -1.10466,-2.41172 -2.68388,-2.14756c-8.06423,4.2654 -15.66761,9.16317 -22.95538,14.49777c-1.55178,1.02575 -0.93313,3.01894 1.11381,2.64958l21.57284,-1.57465c2.09496,-0.34649 3.10585,-1.75076 3.35514,-3.89489zm-129.21977,0l0.40138,-9.53024c0.21956,-1.67986 1.10466,-2.41172 2.68503,-2.14756c8.06423,4.2654 15.66532,9.16317 22.95423,14.49777c1.55178,1.02575 0.93427,3.01894 -1.11266,2.64958l-21.57284,-1.57465c-2.09496,-0.34649 -3.10699,-1.75076 -3.35514,-3.89489zm46.17148,-111.33712l37.43257,0c1.25904,0 2.28593,1.03605 2.28593,2.28593l0,5.95783a2.30194,2.30194 0 0 1 -2.28593,2.28593l-37.43257,0a2.29622,2.29622 0 0 1 -2.28593,-2.28593l0,-5.95783c0,-1.25675 1.0269,-2.28593 2.28593,-2.28593zm-39.364,18.06904l115.6414,0a2.81082,2.81082 0 0 1 2.79595,2.80967l0,60.99859c0,1.53348 -1.24874,2.38199 -2.79595,2.79595c-39.66132,12.05289 -75.98008,11.55316 -115.6414,0c-1.56322,-0.41739 -2.79595,-1.26247 -2.79595,-2.79595l0,-61.01231c-0.01372,-1.54606 1.25904,-2.79595 2.79595,-2.79595zm57.84014,-84.23985c78.95099,0 142.94908,63.99809 142.94908,142.94908s-63.99809,142.94908 -142.94908,142.94908s-142.94908,-63.99809 -142.94908,-142.94908s63.99809,-142.94908 142.94908,-142.94908z"/>
 </g>
</svg>
	`;
        const customIcon = this.L.divIcon({
            html: svgIcon,
            className: '',
            iconSize: [30, 30],
            iconAnchor: [15, 30],
        });

        const marker = this.L.marker(coords, { icon: customIcon }).addTo(this.map);

        const linesHtml = Array.isArray(lines)
            ? lines.map(line =>
                `<span style="
                display:flex;
                background:${line.color};
                color:#fff;
                border-radius:4px;
                width: 20px;
                height: 20px;
                padding:2px;
                font-size:13px;
                font-weight:500;
                align-items: center;
                justify-content: center;

            ">${line.name}</span>`
            ).join('')
            : '';

        marker.bindPopup(`
            <div style="">
            <h4 style="margin:0 0 2px 0;">${stopName}</h4>
            <div style="display:flex;gap:2px;">${linesHtml}</div>
            <button style="margin-top:8px;padding:4px 10px;background:${iconColor};color:#fff;border:none;border-radius:4px;cursor:pointer;">
                Vedi orari
            </button>
            </div>
        `, { maxWidth: 300,offset: L.point(0, -20) });

        marker.on('click', () => marker.openPopup());
    }


    drawRoute() {
        this.L.Routing.control({
            waypoints: [
                this.userLatLon,
                this.searchLatLng
            ],
            routeWhileDragging: true,
            geocoder: this.L.Control.Geocoder.nominatim(), // opzionale
            createMarker: (i, wp, nWps) => {
                if (i === 1) {
                    return this.L.marker(wp.latLng);
                }
            }
        }).addTo(this.map);
    }

    searchBar() {
        let endMarker = undefined;
        this.L.Control.geocoder({
            defaultMarkGeocode: false
        })
            .on('markgeocode', (e) => {
                const end = e.geocode.center;
                this.searchLatLng = [end.lat, end.lng];

                if (endMarker) {
                    endMarker.setLatLng(end);
                } else {
                    endMarker = this.L.marker(end).addTo(this.map);
                }

                this.drawRoute();

                this.map.fitBounds(this.L.latLngBounds(this.userLatLon, this.searchLatLng));
            })
            .addTo(this.map);
    }

}