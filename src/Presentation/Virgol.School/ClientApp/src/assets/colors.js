const colors = ['sky-blue', 'redish', 'greenish', 'purplish' 
                , 'grayish' , 'yellow-400' , 'red-400' , 'gray-600' , 'pink-500']

const getColor = code => {
    return colors[code % colors.length]
}

export default getColor;