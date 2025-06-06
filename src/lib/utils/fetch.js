export function getfwt(url, body = {}) {
    return fetch(`/API/v2/${url}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }).then(async res => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
            const error = new Error(data?.error || `HTTP error ${res.status}`);
            error.status = res.status;
            throw error;
        }
        return data;
    });
}
export function postfwt(url, body = {}) {
    return fetch(`/API/v2/${url}`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(body)
    }).then(async res => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
            const error = new Error(data?.error || `HTTP error ${res.status}`);
            error.status = res.status;
            throw error;
        }
        return data;
    });
}
export function deletefwt(url, body = {}) {
    return fetch(`/API/v2/${url}`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }).then(async res => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
            const error = new Error(data?.error || `HTTP error ${res.status}`);
            error.status = res.status;
            throw error;
        }
        return data;
    });
}
export function patchfwt(url, body = {}) {
    return fetch(`/API/v2/${url}`, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(body)
    }).then(async res => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
            const error = new Error(data?.error || `HTTP error ${res.status}`);
            error.status = res.status;
            throw error;
        }
        return data;
    });
}