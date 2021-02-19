export const querySearch = (list , query) => {
    const queriedItems = list.filter(x => {
        if(x.firstName.includes(query) || 
        x.lastName.includes(query) || 
        (x.firstName + " " + x.lastName).includes(query)){
            return true
        }

        if(x.melliCode && x.melliCode.includes(query)){
            return true
        }

        if(x.phoneNumber && x.phoneNumber.includes(query)){
            return true
        }

        if(x.personalIdNUmber && x.personalIdNUmber.includes(query)){
            return true
        }

        if(x.schoolName && x.schoolName.includes(query)){
            return true
        }

        if(x.fatherPhoneNumber && x.fatherPhoneNumber.includes(query)){
            return true
        }

        if(x.fatherName && x.fatherName.includes(query)){
            return true
        }
    })

    // const nameQuery = list.filter(x => x.firstName.includes(query))
    // const familyQuery = list.filter(x => x.lastName.includes(query))
    // const 

    

    return queriedItems
}

export const pagingItems = (list , currentPage , itemsPerPage) => {
    const pagedItems = list.slice((currentPage - 1) * itemsPerPage , currentPage  * itemsPerPage);

    return pagedItems
}