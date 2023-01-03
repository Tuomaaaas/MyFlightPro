import {
  getPositions,
  getFlight
} from '/search.js';

import {
  getICAO,
} from '/getLocation.js';

import {getLocalStorageItem, setLocalStorageItem} from '../Cache.js';

const FlightInfo = {
  heading: "Unknown",
  altitude: "Unknown",
  flightStatus: "Unknown",
  operator: "Unknown",
  flightNumber: "Unknown",
  departureAirport: "Unknown",
  arrivalAirport:"Unknown",
};

//Defining all of the buttons
const searchCityAirportButton= document.getElementById("searchCityAirportButton");
if (searchCityAirportButton !== null) {
  searchCityAirportButton.addEventListener('click', function() {
    changeCity();
  });
}

let map = L.map('map').setView([55.22, 21.01], 4);
let markerGroup = L.layerGroup().addTo(map);

//This adds the map data to the map base -Miro
L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=KCZTrF8TTlBLo55Yy2H8',{
  tileSize: 512,
  zoomOffset: -1,
  minZoom: 1,
  crossOrigin: true
}).addTo(map);

//This function draws the markers to the map. -Miro
async function addToMap (lat, lon, direction, callsign, ICAO) {
  let marker = L.marker([lat, lon]).addTo(markerGroup).on('click', await printFlightInfo(direction, callsign, ICAO));
  marker.bindPopup('<strong>' + FlightInfo.flightNumber + '</strong></br>'+ '<strong>' + "Operator: " + '</strong>' + FlightInfo.operator + '</br>' + '<strong>' + "Heading: " + '</strong>' + FlightInfo.heading + '</br><strong>' + "Altitude: " + '</strong>' + FlightInfo.altitude + '</br><strong>' + "Departure: " + '</strong>' + FlightInfo.departureAirport + '</br><strong>' + "Arrival: " + '</strong>' + FlightInfo.arrivalAirport + '</br><strong>' + "Status: " + '</strong>' + FlightInfo.flightStatus);
}

//This function prints out the active flights from the API to the livemap. -Tuomas
async function getFlightsPosition(ICAO){
  if (ICAO === undefined) {
    ICAO = await getICAO();
  }

  let departures;
  let arrivals;

  departures = await getPositions(ICAO, "Departures");
  arrivals = await getPositions(ICAO, "Arrivals");
  const flights = {
    dep: departures,
    arr: arrivals
  }

  for (let i = 0; i<departures.length; i++){
    const latitude = departures[i][0];
    const longitude = departures[i][1];
    const callsign = departures[i][4];

    await addToMap(latitude, longitude, "dep", callsign, ICAO);
  }
  for (let i = 0; i<arrivals.length; i++){
    const latitude = arrivals[i][0];
    const longitude = arrivals[i][1];
    const callsign = arrivals[i][4];

    await addToMap(latitude, longitude, "arr", callsign, ICAO);
  }
  setLocalStorageItem(ICAO + "_map", flights);
}

async function printFlightInfo(direction, callsign, ICAO){
  if (callsign === null){
    return null;
  }

  //from AirLabs
  let positionInfoCache = getLocalStorageItem(ICAO + "_map");
  if (positionInfoCache === null){
    } else {
    switch (direction){
      case "dep":
        if (positionInfoCache.dep.length !== 0){
          for (let i = 0; i < positionInfoCache.dep.length; i++) {
            if (positionInfoCache.dep[i][4] === callsign) {
              FlightInfo.heading = positionInfoCache.dep[i][2];
              FlightInfo.altitude = positionInfoCache.dep[i][3];
              FlightInfo.flightStatus = positionInfoCache.dep[i][5];
            }
          }
        }
        break;
      case "arr":
        if (positionInfoCache.arr.length !== 0){
          for (let i = 0; i < positionInfoCache.arr.length; i++) {
            if (positionInfoCache.arr[i][4] === callsign) {
              FlightInfo.heading = positionInfoCache.arr[i][2];
              FlightInfo.altitude = positionInfoCache.arr[i][3];
              FlightInfo.flightStatus = positionInfoCache.arr[i][5];
            }
          }
        }
        break;
    }
  }

  //from AeroDataBox
  let result;
  const flightInfoCache = getLocalStorageItem(callsign);
  if (flightInfoCache === null) {
    result = await getFlight(undefined, callsign);
    setLocalStorageItem(callsign, result);
    setLocalStorageItem(FlightInfo.flightNumber, result);
  } else {
    result = flightInfoCache;
  }
  if (result.length !== 0) {
    FlightInfo.operator = result[0].airline.name;
    FlightInfo.flightNumber = result[0].number;
    FlightInfo.departureAirport = result[0].departure.airport.name;
    FlightInfo.arrivalAirport = result[0].arrival.airport.name;
  }
}

//This function is called, when the user searched for a city/airport from the free text search. It clears the map from the markers and then gets the new city's airports ICAO code. -Tuomas
async function changeCity(){
  let icao;
  const searchField = document.getElementById("searchCityAirportText").value;
  const cache = getLocalStorageItem(searchField);
  if (cache === null) {
    icao = await getICAO(searchField);
    if (icao.length !== 0){
      setLocalStorageItem(searchField, icao);
    }
  } else {
    icao = cache;
  }
  if (icao === null){
    return null;
  }
  markerGroup.clearLayers();
  await getFlightsPosition(icao);
}