import { getAirport } from './search.js';
import {printArrDep, searchAirportInfo} from './PrintInfo.js';

//Defining all of the buttons
const searchAirportButton = document.getElementById("SearchWithLocationButton");
if (searchAirportButton !== null) {
  searchAirportButton.addEventListener('click', function() {
    printLocation();
  });
}

//This function returns an array including info about your location from your IP-address. -Tuomas
async function getLocation() {
  const contains = await fetch("https://ipwho.is/")
  const result = await contains.json();
  return result;
}

//This function prints out users locations nearest airport ICAO code for the API and also the airports name for the user to verify, which airport info they are looking at. -Tuomas
async function printLocation(){
  const location = await getLocation();
  const city = location.city;
  let airportInfo = await getAirport(city);
  //If no airport is found from the users location, the program prints out a message. -Tuomas
  if (airportInfo.items.length === 0){
    const location = document.getElementById('currentAirport');
    const message = document.createElement('h1');
    message.innerHTML = "No airports found from your current location!";
    location.appendChild(message);
  } else {
    let ICAO = airportInfo.items[0].icao;
    let airportName = airportInfo.items[0].name;
    await printArrDep(ICAO, airportName);
  }
}

//This function returns the ICAO code of the city's main airport. The city is given to the function as a parameter. -Tuomas
export async function getICAO(city){
  if (city === undefined) {
    const location = await getLocation();
    city = location.city;
  }
  let airportInfo = await getAirport(city);
  if (airportInfo.items.length === 0){
    console.log("No airport found!")
  } else {
    let ICAO = airportInfo.items[0].icao;
    return ICAO;
  }
}

export async function getTimeZone(){
  const contains = await getLocation();
  return contains.timezone.id;
}