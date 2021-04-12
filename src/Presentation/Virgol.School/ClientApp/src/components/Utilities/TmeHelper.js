export const getDayOfWeek = (dayNum = null) =>{
    if(dayNum == null)
        dayNum = new Date().getDay()
    
    var dayOfWeek = dayNum + 2;
        dayOfWeek = (dayOfWeek > 7 ? dayOfWeek - 7 : dayOfWeek);

        return dayOfWeek;
}