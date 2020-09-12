export const fullNameSerach = (list , query) => {

    const queriedItems = list.filter(x => x.firstName.includes(query) || 
    x.lastName.includes(query) || 
    (x.firstName + " " + x.lastName).includes(query))

    return queriedItems
}

export const pagingItems = (list , currentPage , itemsPerPage) => {

    const pagedItems = list.slice((currentPage - 1) * itemsPerPage , currentPage  * itemsPerPage);

    return pagedItems
}