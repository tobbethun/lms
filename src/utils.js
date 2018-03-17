

// remove localstorage after one day
export const checkLS = () => {
    const object = JSON.parse(localStorage.getItem("loggedIn"));
    const dateString = object.timestamp;
    const now = new Date().getTime();
    if ((now - dateString) > 86400000) {
        localStorage.removeItem('loggedIn');
        return false
    } else {
        return true
    }
};

export const isLoggedIn = () => {
    if (localStorage.loggedIn && checkLS()) {
        return true
    } else {
        return false
    }
};

export const getUser = () => {
    const object = JSON.parse(localStorage.getItem("loggedIn"));
    return object.user;
};