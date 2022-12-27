export function IPGeolocation() {
  const locationOptions = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Host': 'ip-geolocation-ipwhois-io.p.rapidapi.com',
      'X-RapidAPI-Key': '74f0927946mshe7281fe540d5c51p1a2aa5jsnd6cc563ec47c'
    }
  };
}

export function AeroDatabox() {
  return {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '74f0927946mshe7281fe540d5c51p1a2aa5jsnd6cc563ec47c',
      'X-RapidAPI-Host': 'aerodatabox.p.rapidapi.com'
    }
  };
}

export function AirLabsKey() {
  return "b29ee1d8-b889-4115-9807-b65982aa7150";
}