import 'leaflet/dist/leaflet.css';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

export class Map {
    constructor(mapElement) {
        this.L = undefined;
        this.ControlGeocoder = undefined;
        this.Routing = undefined;
        this.userLatLng = undefined;
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

                this.userLatLng = [pos.coords.latitude, pos.coords.longitude];

                if (!accuracyCircle) {
                    accuracyCircle = this.L.circle(this.userLatLng, { radius: accuracy, weight: 2 }).addTo(this.map);
                    userCircle = this.L.circleMarker(this.userLatLng, {
                        fill: true,
                        color: '#ffffff',
                        fillOpacity: 1,
                        weight: 2,
                        fillColor: '#0045ff',
                        radius: 8
                    }).addTo(this.map);
                    this.map.setView(this.userLatLng, 15);
                } else {
                    accuracyCircle.setLatLng(this.userLatLng);
                    userCircle.setLatLng(this.userLatLng);
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

        L.marker(coords, { icon: icon }).addTo(this.map);
    }

    drawRoute() {
        this.L.Routing.control({
            waypoints: [
                this.userLatLng,
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

                this.map.fitBounds(this.L.latLngBounds(this.userLatLng, this.searchLatLng));
            })
            .addTo(this.map);
    }

}