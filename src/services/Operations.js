let storage = window.localStorage;

// export const BASE_API_URL = "http://localhost:8080";
export const BASE_API_URL = "https://vpolo-savy-api.herokuapp.com";

export const AUTHENTICATION_KEY = storage.getItem('auth');

export const getCurrentMonthOperations = (successCallback, errorCallback) => {
    return fetch(`${BASE_API_URL}/operations/current-month`, {
        method: 'GET',
        headers: { 'x-authentication': AUTHENTICATION_KEY }
    })
        .then(response => response.json())
        .then(operations => successCallback(operations.operations))
        .catch(error => errorCallback(error));
};

export const getMonthSummary = (successCallback, errorCallback) => {
    return fetch(`${BASE_API_URL}/summary`, {
        method: 'GET',
        headers: { 'x-authentication': AUTHENTICATION_KEY }
    })
        .then(response => response.json())
        .then(response => successCallback(response.summary))
        .catch(error => errorCallback(error));
};


export const getBudgets = (successCallback, errorCallback) => {
    return fetch(`${BASE_API_URL}/budgets`, {
        method: 'GET',
        headers: { 'x-authentication': AUTHENTICATION_KEY }
    })
        .then(response => response.json())
        .then(response => successCallback(response.budgets))
        .catch(error => errorCallback(error));
};

export const addBudget = (label, amount) => {
    return fetch(`${BASE_API_URL}/budgets`, {
        method: 'POST',
        body: JSON.stringify({ label, amount }),
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'x-authentication': AUTHENTICATION_KEY
        },
    })
};

export const removeBudget = budget => {
    return fetch(`${BASE_API_URL}/budgets/${budget}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'x-authentication': AUTHENTICATION_KEY
        },
    });
};


export const add = (label, amount) => {
    return fetch(`${BASE_API_URL}/operations`, {
        method: 'POST',
        body: JSON.stringify({ label, amount }),
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'x-authentication': AUTHENTICATION_KEY
        },
    })
};

export const toggle = (operation, status) => {
    return fetch(`${BASE_API_URL}/operations/${operation}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'x-authentication': AUTHENTICATION_KEY
        },
    });
};

export const remove = operation => {
    return fetch(`${BASE_API_URL}/operations/${operation}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'x-authentication': AUTHENTICATION_KEY
        },
    });
};

export const importOperationsFromBudget = () => {
    return fetch(`${BASE_API_URL}/transfer-budgets`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'x-authentication': AUTHENTICATION_KEY
        },
    });
};