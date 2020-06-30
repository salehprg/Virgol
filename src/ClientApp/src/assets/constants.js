const prod = {
    url: {
        API_URL: ''
    }
}

const dev = {
    url: {
        API_URL: ''
    }
}

export const config = process.env.NODE_ENV === 'development' ? dev : prod