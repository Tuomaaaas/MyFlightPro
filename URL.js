import { AirLabsKey } from './API_keys.js';

export const URLS = {
  urlAirport: "https://aerodatabox.p.rapidapi.com/airports/search/term?q=",
  urlFlightNumber: "https://aerodatabox.p.rapidapi.com/flights/number/",
  urlFlightCallsign: "https://aerodatabox.p.rapidapi.com/flights/callsign/",
  urlAirplanePicture: "https://aerodatabox.p.rapidapi.com/aircrafts/reg/",
  urlFlightsICAO: "https://aerodatabox.p.rapidapi.com/flights/airports/icao/",
  urlDelaysICAO: "https://aerodatabox.p.rapidapi.com/airports/icao/",
  urlDeparturesPositions1: "https://airlabs.co/api/v9/flights?dep_icao=",
  urlDeparturesPositions2: "&_view=array&_fields=lat,lng,dir,alt,flight_icao,status&api_key=" + AirLabsKey(),
  urlArrivalsPositions1: "https://airlabs.co/api/v9/flights?arr_icao=",
  urlArrivalsPositions2: "&_view=array&_fields=lat,lng,dir,alt,flight_icao,status&api_key=" + AirLabsKey(),
  urlIPGeolocation: "https://ipwho.is/"
};