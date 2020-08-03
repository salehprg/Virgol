const colors = ['sky-blue', 'redish', 'greenish', 'purplish']

const getColor = code => {
    return colors[code % colors.length]
}

export default getColor;