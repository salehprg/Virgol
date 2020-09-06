const colors = ['sky-blue', 'redish', 'greenish', 'purplish' 
                , 'grayish' , 'red-400' , 'gray-600' , 'pink-500']

const getColor = code => {
    return colors[code % colors.length]
}

export default getColor;