import { getTimeZone } from './getLocation.js';

export function getCurrentDate(){
  return new Date().toLocaleDateString('en-CA', {timeZone: 'Europe/Helsinki', hour12: false});
}

export function getCurrentTime(){
  return new Date().toLocaleTimeString('en-CA', {timeZone: 'Europe/Helsinki', hour12: false}).slice(0,5);
}

export function getNextHourTime(){
  let nextHour = new Date();
  nextHour.setHours(nextHour.getHours() + 1);
  return nextHour.toLocaleTimeString('en-CA', {timeZone: 'Europe/Helsinki', hour12: false}).slice(0,5);
}
export function getCurrentHours(){
  return new Date().toLocaleTimeString('en-CA', {timeZone: 'Europe/Helsinki', hour12: false}).slice(0,2);
}

export function getCurrentMinutes(){
  return new Date().toLocaleTimeString('en-CA', {timeZone: 'Europe/Helsinki', hour12: false}).slice(3,5);
}

export function getNextDay(){
  const today = new Date();
  let tomorrow =  new Date();
  tomorrow.setDate(today.getDate() + 1);
  return tomorrow.toLocaleDateString('en-CA', {timeZone: 'Europe/Helsinki', hour12: false});
}

export function getNextHourDateAndTime(){
  if (getNextHourTime().slice(0,2) === "00"){
    return getNextDay() + "T" + getNextHourTime();
  } else {
    return getCurrentDate() + "T" + getNextHourTime();
  }
}

export function getTime(date){
  if (date != null) {
    let time = new Date(date)
    return time.getHours().toLocaleString('en-CA') + ":" + time.getMinutes().toLocaleString('en-CA');
  }
}

function setTimeZone(){
  const timezone = getTimeZone();
  if (timezone == undefined){
    return "Europe/London"
  } else {
    return timezone;
  }
}