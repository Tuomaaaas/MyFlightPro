import { getAirport } from './search.js';
import {printArrDep, searchAirportInfo} from './PrintInfo.js';

//Defining all of the buttons
const searchAirportButton = document.getElementById("SearchWithLocationButton");
if (searchAirportButton !== null) {
  searchAirportButton.addEventListener('click', function() {
    printWithLocation();
  });
}

//This function returns an array including info about your location from your IP-address. -Tuomas
async function getLocation() {
  try {
    const contains = await fetch("https://ipwho.is/");
    const result = await contains.json();
    return result;
  } catch (error){
    console.log("No information found with that ip address!");
    return null;
  }
}

//This function prints out users locations nearest airport ICAO code for the API and also the airports name for the user to verify, which airport info they are looking at. -Tuomas
async function printWithLocation(){
  const location = await getLocation();
  if (location === null) {
    return null;
  }
  const city = location.city;
  let airportInfo = await getAirport(city);

  if (airportInfo === null){
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
    if (location === null){
      return null;
    } else {
      city = location.city;
    }
  }
  let airportInfo = await getAirport(city);
  if (airportInfo === null){
    console.log("No airport found!")
    return null;
  } else {
    let ICAO = airportInfo.items[0].icao;
    return ICAO;
  }
}

export async function getTimeZone(){
  const contains = await getLocation();
  return contains.timezone.id;
}