var getUrl = window.location;
var baseUrl = getUrl .protocol + "//" + getUrl.host + "/" + getUrl.pathname.split('/')[1];

const prod = {
    url: {
        API_URL: baseUrl + 'api/'
    }
}

const dev = {
    url: {
        API_URL: 'https://localhost:5001/api/'
    }
}

export const config = process.env.NODE_ENV !== 'development' ? dev : prod