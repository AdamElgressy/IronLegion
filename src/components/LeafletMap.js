import React from 'react';
import {Map, Marker, Popup, TileLayer, ZoomControl} from 'react-leaflet';
import '../App.css';
import L from "leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import localforage from 'localforage';
import 'leaflet-offline';
import {GeoSearchControl, OpenStreetMapProvider} from 'leaflet-geosearch';

//data for list of markers
let markerList = [
    {
        lat: 17.441013,
        lng: 78.391796,
        name: "Mark I",
        info: 10
    },
    {
        lat: 17.442889,
        lng: 78.396873,
        name: "Mark II",
        info: 20
    },
    {
        lat: 17.441681,
        lng: 78.394357,
        name: "Mark III",
        info: 30
    },
    {
        lat: 17.441597,
        lng: 78.356214,
        name: "Mark IV",
        info: 40
    },
    {
        lat: 17.441264,
        lng: 78.360184,
        name: "Mark V",
        info: 50
    }
];


//Defining the custom marker with an hospital building icon
const customMarker = new L.icon({
    iconUrl: require('../assets/iron-man-png.png'),
    iconSize: new L.Point(50, 70),
    // iconAnchor:   [22, 94],
});

//The Map definition
class LeafletMap extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            lat: 17.44212,
            lng: 78.391384,
            zoom: 15,
            maxZoom: 30
        }
    }

    componentDidMount() {
        //Defining the offline layer for the map
        const map = L.map('map-id');
        const offlineLayer = L.tileLayer.offline('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', localforage, {
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            subdomains: 'abc',
            minZoom: 13,
            maxZoom: 19,
            crossOrigin: true
        });
        offlineLayer.addTo(map);//add the offline layer
        map.zoomControl.remove();
    }

    //Defining the custom icon for clusters
    customIconCreateFunction(cluster) {
        return L.divIcon({
            html: `<span>${cluster.getChildCount()}</span>`,
            className: "marker-cluster-custom",
            iconSize: L.point(40, 40, true)
        });
    }

    //Render pop up for markers
    renderPopup = (index) => {
        return (
            <Popup tipSize={5} anchor="bottom-right" longitude={markerList[index].lng} latitude={markerList[index].lat}>
                <p>
                    <strong>{markerList[index].name}</strong>
                    <br/>
                    Location:{markerList[index].info}
                    <br/>
                    Speed:{markerList[index].info}
                    <br/>
                    Mission:{markerList[index].info}
                </p>
            </Popup>
        );
    }

    //render the map
    render() {
        const position = [this.state.lat, this.state.lng];
        console.log(position);

        return (
            <div id="map-id">
                <Map center={position} zoom={13} maxZoom={20} id="map">
                    <ZoomControl position="topright"/>
                    <TileLayer
                        // url='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
                        //   attribution= 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                        attribution="&copy; <a href=&quot;https://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                        url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
                    />
                    <MarkerClusterGroup
                        showCoverageOnHover={true}
                        spiderfyDistanceMultiplier={2}
                        iconCreateFunction={this.customIconCreateFunction}
                    >
                        {markerList.map((marker, index) => {
                            let post = [marker.lat, marker.lng];
                            return (
                                <Marker key={index} position={post} icon={customMarker}>
                                    {this.renderPopup(index)}
                                </Marker>
                            );
                        })}
                    </MarkerClusterGroup>
                </Map>
            </div>
        );
    }
}


export default LeafletMap;
