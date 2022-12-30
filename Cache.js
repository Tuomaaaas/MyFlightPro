const expiryTime = 60000;


function getLocalStorageItem(key) {
  if (localStorage.getItem(key) !== null) {
    const data = JSON.parse(localStorage.getItem(key));
    /*if (data.expiry && Date.now() > data.expiry) {
      console.log("Cache expired!");
      localStorage.removeItem(key);
      return null;
    } else {
      console.log("Found from cache!");
      return data.value;
    }
     */
    return data.value;
  }
  return null;
}

function setLocalStorageItem(key, value) {
  const item = {
    value: value,
    expiry: expiryTime ? Date.now() + expiryTime : null
  };

  localStorage.setItem(key, JSON.stringify(item));
}

export { getLocalStorageItem, setLocalStorageItem };