const colors = ['sky-blue', 'redish', 'greenish', 'purplish' 
                , 'grayish' , 'red-400' , 'gray-600' , 'pink-500']

const getColor = code => {
    return colors[code % colors.length]
}

export const MyViolet = '#7033ff'
export const MySpaceCadet = '#242747'
export const MySeaGreen = '#0dbcb0'
export const MyBabyPowder = '#fffffa'

export default getColor;