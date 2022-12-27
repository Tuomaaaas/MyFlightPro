import { AeroDatabox } from './API_keys.js';
import { URLS } from './URL.js';
import * as Date from './Date.js';
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
export async function getFlight(number, callsign) {
  let url;
  if (number === undefined){
    const searchField = document.getElementById("SearchFlightText").value;
    url = URLS.urlFlightNumber + searchField;
  } else if (number !== undefined){
    number = number.replace(/\s+/g, '');
    if (callsign === 0) {
      url = URLS.urlFlightNumber + number;
    } else {
      url = URLS.urlFlightCallsign + number;
    }
  }
  const contains = await fetch(url + "/" + Date.getCurrentDate(), AeroDatabox());
  const result = await contains.json();
  return result;
}

//This function searches for the specific aircraft picture, by the registeration number which it gets as a parameter. -Tuomas
export async function getPicture(registeration){
  if (registeration !== undefined) {
    try {
      const contains = await fetch(
          URLS.urlAirplanePicture + registeration +
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
  let endtime = Date.getNextHourDateAndTime();
  const starttime = Date.getCurrentDate() + "T" + Date.getCurrentTime();
  const contains = await fetch(URLS.urlFlightsICAO + ICAO + '/' + starttime + '/' + endtime + '?withCodeshared=false', AeroDatabox())
  const result = await contains.json();
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