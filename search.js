import { AeroDatabox } from './API_keys.js';
import { URLS } from './URL.js';
import * as date from './Date.js';
import {getLocalStorageItem, setLocalStorageItem} from './Cache.js';

//This function returns an array of airports that meets the requirements of the text given from the free text search. -Tuomas
export async function getAirport(city) {
  let url;
  if (city === undefined){
    const searchField = document.getElementById("searchAirportText").value;
    url = URLS.urlAirport + searchField;
  } else {
    url = URLS.urlAirport + city;
  }
  const contains = await fetch(url, AeroDatabox())
  const result = await contains.json();
  return result;
}

//This function returns an array containing a specific flight, searched by the user. -Tuomas
export async function getFlight(flightNumber, flightCallsign) {
  let result;
  if (flightNumber === undefined && flightCallsign === undefined) {
    const searchField = document.getElementById("SearchFlightText").value;
    let url = URLS.urlFlightNumber + searchField;
    result = await getFlightInfo(url);
    if (result.length === 0){
      url = URLS.urlFlightCallsign + searchField;
      result = await getFlightInfo(url);
    }
    return result;
  } else if (flightNumber !== undefined && flightCallsign === undefined){
    flightNumber = flightNumber.replace(' ', '');
    let url = URLS.urlFlightNumber + flightNumber;
    return await getFlightInfo(url);
  } else if (flightNumber === undefined && flightCallsign !== undefined){
    let url = URLS.urlFlightCallsign + flightCallsign;
    return await getFlightInfo(url);
  }
  async function getFlightInfo(url) {
    try {
      const contains = await fetch(url, AeroDatabox());
      const result = await contains.json();
      return result;
    } catch (error) {
      return "";
    }
  }
}

//This function searches for the specific aircraft picture, by the registeration number which it gets as a parameter. -Tuomas
export async function getPicture(registration){
  if (registration !== undefined) {
    try {
      const contains = await fetch(
          URLS.urlAirplanePicture + registration +
          '/image/beta', AeroDatabox())
      let result = await contains.json();
      result = result.url;
      return result;
    } catch (error) {
      console.log("No photo found!");
    }
  }
}

//This function returns an array containing all of the arriving and departing aircrafts from the specific airport in a timescale of this moment to and hour forwards. -Tuomas
export async function getArrDep(ICAO){
  const cache = getLocalStorageItem(ICAO);
  if (cache !== null){
    return cache;
  }
  let endtime = date.getNextHourDateAndTime();
  const starttime = date.getCurrentDate() + "T" + date.getCurrentTime();
  const contains = await fetch(URLS.urlFlightsICAO + ICAO + '/' + starttime + '/' + endtime + '?withCodeshared=false', AeroDatabox())
  const result = await contains.json();
  setLocalStorageItem(ICAO, result);
  return result;
}

//This function returns and array containing info about the delays of the specific airport. -Tuomas
export async function getDelays(ICAO){
  const contains = await fetch(URLS.urlDelaysICAO + ICAO + '/delays/2022-12-27T15:00/2022-12-27T17:00', AeroDatabox());
  const result = await contains.json();
  return result;
}

//This function returns the live position, direction, altitude, flight ICAO and status, either from all of the departing or arriving flights from the specific airport. -Tuomas
export async function getPositions(ICAO, direction) {
  if (direction === "Departures") {
    const contains = await fetch(
        URLS.urlDeparturesPositions1 + ICAO +
        URLS.urlDeparturesPositions2);
    const departures = await contains.json();
    return departures;
  } else if (direction === "Arrivals") {
    const contains = await fetch(
        URLS.urlArrivalsPositions1 + ICAO +
        URLS.urlArrivalsPositions2);
    const arrivals = await contains.json();
    return arrivals;
  }
}