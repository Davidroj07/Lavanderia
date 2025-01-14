// transactionService.js

// Método para realizar un POST con los parámetros de la transacción
export const postTransaction = (url, params) => {
    // Construir la query string a partir de los parámetros
    const queryString = new URLSearchParams(params).toString();
    const fullUrl = `${url}?${queryString}`;

    return fetch(fullUrl, {
        method: 'POST',  // Usamos el método POST, pero los parámetros irán en la URL
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => response.json())
        .then(data => {
            return data; // Retornar los datos para su posterior uso
        })
        .catch(error => {
            console.error('Error en la transacción POST:', error);
            throw error; // Lanzar el error para ser manejado en otro lugar
        });
};


// Método para realizar un GET con los parámetros de la transacción
export const getTransaction = (url, params) => {
    const queryString = new URLSearchParams(params).toString();
    const fullUrl = `${url}?${queryString}`;

    return fetch(fullUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => response.json())
        .then(data => {
            return data; // Retornar los datos para su posterior uso
        })
        .catch(error => {
            console.error('Error en la transacción GET:', error);
            throw error; // Lanzar el error para ser manejado en otro lugar
        });
};

// Método para realizar una PUT (actualización) con los parámetros de la transacción
export const putTransaction = (url, params) => {
    return fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
    })
        .then(response => response.json())
        .then(data => {
            return data; // Retornar los datos para su posterior uso
        })
        .catch(error => {
            console.error('Error en la transacción PUT:', error);
            throw error; // Lanzar el error para ser manejado en otro lugar
        });
};

// Método para realizar un DELETE con los parámetros de la transacción
export const deleteTransaction = (url, params) => {
    return fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
    })
        .then(response => response.json())
        .then(data => {
            return data; // Retornar los datos para su posterior uso
        })
        .catch(error => {
            console.error('Error en la transacción DELETE:', error);
            throw error; // Lanzar el error para ser manejado en otro lugar
        });
};
