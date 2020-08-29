export const baseUrl = () => {
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.hostname === "verify-clients.onoi.kg") {
        return 'https://test.sessionserver.onoi.kg/';
    } else {
        return `https://smartidkg.onoi.kg/`
    }
}

export const baseUrlRegistration = () => {
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.hostname === "verify.onoi.kg") {
        return 'https://test.smartidregistration.onoi.kg/';
    } else {
        return `https://smartidregistration.onoi.kg/`
    }
}