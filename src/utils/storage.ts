export const localStorageGetItem = (key: string) => {
    try {
        return localStorage.getItem(key);
    }
    catch (ex) {
        console.warn(ex.message);
    }
    return null;
}


export const localStorageSetItem = (key: string, value: string) => {
    try {
        localStorage.setItem(key, value);
    }
    catch (ex) {
        console.warn(ex.message);
    }
}


export const localStorageRemoveItem = (key: string) => {
    try {
        localStorage.removeItem(key);
    }
    catch (ex) {
        console.warn(ex.message);
    }
}

export const sessionStorageGetItem = (key: string) => {
    try {
        return sessionStorage.getItem(key);
    }
    catch (ex) {
        console.warn(ex.message);
    }
    return null;
}

export const sessionStorageSetItem = (key: string, value: string) => {
    try {
        sessionStorage.setItem(key, value);
    }
    catch (ex) {
        console.warn(ex.message);
    }
}

export const sessionStorageRemoveItem = (key: string) => {
    try {
        sessionStorage.removeItem(key);
    }
    catch (ex) {
        console.warn(ex.message);
    }
}