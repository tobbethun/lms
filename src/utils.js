

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
    if(object !== null) {
        return object.user;
    }
};

export const handleErrors = (response) => {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}

export const formatTime = (timeStamp) => {
    const date = timeStamp.split(' ')[0];
    const time = timeStamp.split(' ')[1].split('.')[0];
    return date + ' - ' + time.substring(0,5);
}

export const delay = t => new Promise(resolve => setTimeout(resolve, t));

