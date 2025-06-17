export const setLocalStorage = (key, value) => {
    localStorage.setItem(key, value);
}

export const getLocalStorageData = (key) => {
    const localData = localStorage.getItem(key);
    if (localData) {
        return localData
    } else {
        return false
    }
}

export const clearLocalStorage = () => {
    localStorage.clear();
}