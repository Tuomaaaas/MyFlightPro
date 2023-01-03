import { AeroDatabox } from './API_keys.js';
import { URLS } from './URL.js';
import * as date from './Date.js';
import {getLocalStorageItem, setLocalStorageItem} from './Cache.js';


//This function returns an array of airports that meets the requirements of the text given from the free text search. -Tuomas
export async function getAirport(city) {
  let url;
  let cache;
  if (city === undefined){
    const searchField = document.getElementById("searchAirportText").value;
    url = URLS.urlAirport + searchField;
    cache = getLocalStorageItem(searchField);
  } else {
    url = URLS.urlAirport + city;
    cache = getLocalStorageItem(city);
  }
  if (cache !== null){
    return cache;
  }
  try {
    const contains = await fetch(url, AeroDatabox())
    const result = await contains.json();
    return result;
  } catch (error){
    return null;
  }
}

//This function returns an array containing a specific flight, searched by the user. -Tuomas
export async function getFlight(flightNumber, flightCallsign) {
  let result;
  if (flightNumber === undefined && flightCallsign === undefined) {
    const searchField = document.getElementById("SearchFlightText").value;
    result = await getFlightInfo(searchField, "Number");
    if (result === null){
      result = await getFlightInfo(searchField, "Callsign");
    }
    return result;
  } else if (flightNumber !== undefined && flightCallsign === undefined){
    flightNumber = flightNumber.replace(' ', '');
    return await getFlightInfo(flightNumber, "Number");
  } else if (flightNumber === undefined && flightCallsign !== undefined){
    return await getFlightInfo(flightCallsign, "Callsign");
  }

  async function getFlightInfo(identification, type) {
    const cache = getLocalStorageItem(identification);
    if (cache !== null){
      return cache;
    }
    let url;
    if (type === "Callsign"){
      url = URLS.urlFlightCallsign + identification;
    } else if (type === "Number"){
      url = URLS.urlFlightNumber + identification;
    }
    try {
      const contains = await fetch(url, AeroDatabox());
      const result = await contains.json();
      setLocalStorageItem(identification, result);
      return result;
    } catch (error) {
      return null;
    }
  }
}

//This function searches for the specific aircraft picture, by the registeration number which it gets as a parameter. -Tuomas
export async function getPicture(registration){
  if (!registration){
    console.log("No valid arguments given!");
    return null;
  }
  if (registration !== undefined) {
    const cache = getLocalStorageItem(registration);
    if (cache !== null){
      return cache;
    }
    try {
      const contains = await fetch(
          URLS.urlAirplanePicture + registration +
          '/image/beta', AeroDatabox());
      let result = await contains.json();
      result = result.url;
      setLocalStorageItem(registration, result);
      return result;
    } catch (error) {
      console.log("No photo found!");
      return null;
    }
  }
}

//This function returns an array containing all of the arriving and departing aircrafts from the specific airport in a timescale of this moment to and hour forwards. -Tuomas
export async function getArrDep(ICAO){
  if (!ICAO){
    console.log("No valid arguments given!");
    return null;
  }
  const cache = getLocalStorageItem(ICAO);
  if (cache !== null){
    return cache;
  }
  let endtime = date.getNextHourDateAndTime();
  const starttime = date.getCurrentDateAndTime();
  try {
    const contains = await fetch(
        URLS.urlFlightsICAO + ICAO + '/' + starttime + '/' + endtime +
        '?withCodeshared=false', AeroDatabox())
    const result = await contains.json();
    setLocalStorageItem(ICAO, result);
    return result;
  } catch (error){
    return null;
  }
}

//This function returns and array containing info about the delays of the specific airport. -Tuomas
export async function getDelays(ICAO){
  const starttime = date.getLastHourDateAndTime();
  const endtime = date.getCurrentDateAndTime();
  try {
    const contains = await fetch(
        URLS.urlDelaysICAO + ICAO + "/delays/" + starttime + "/" + endtime,
        AeroDatabox());
    const result = await contains.json();
    return result;
  } catch (error){
    return null;
  }
}

//This function returns the live position, direction, altitude, flight ICAO and status, either from all of the departing or arriving flights from the specific airport. -Tuomas
export async function getPositions(ICAO, direction) {
  if (!ICAO || !direction){
    console.log("No valid arguments given!");
    return null;
  }
  const cacheKey = ICAO + "_map";

  if (direction === "Departures") {
    const cache = getLocalStorageItem(cacheKey);
    if (cache !== null){
      return cache.dep;
    }
    try {
      const contains = await fetch(
          URLS.urlDeparturesPositions1 + ICAO +
          URLS.urlDeparturesPositions2);
      const departures = await contains.json();
      setLocalStorageItem(cacheKey, getLocalStorageItem(cacheKey) + {dep: departures});

      return departures;
    } catch (error){
      return null;
    }
  } else if (direction === "Arrivals") {
    const cache = getLocalStorageItem(cacheKey);
    if (cache !== null){
      return cache.arr;
    }
    try {
      const contains = await fetch(
          URLS.urlArrivalsPositions1 + ICAO +
          URLS.urlArrivalsPositions2);
      const arrivals = await contains.json();
      setLocalStorageItem(cacheKey, getLocalStorageItem(cacheKey) + {arr: arrivals});

      return arrivals;
    } catch (error){
      return null;
    }
  }
}