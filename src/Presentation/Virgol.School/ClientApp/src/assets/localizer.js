const getLogo = (type) => {

    if (type.includes('sampad.razaviedu.ir/')) return '/sampad.svg';
    if (type.includes('idk')) return '/rahedoor.png';
    return '/logo.svg';

}

const getTitle = (type) => {

    if (type.includes('sampad.razaviedu.ir/')) return 'سامانه جامع آموزش مجازی مدارس استعداد های درخشان خراسان رضوی';
    if (type.includes('idk')) return 'سامانه ویرگول';
    return 'سامانه ویرگول';

}

const setFavIcon = (type) => {

    let url = '';
    if (type.includes('sampad.razaviedu.ir/')) url = '/favicon_sampad.ico';
    else if (type.includes('idk')) url = '/favicon_rahedoor.ico';
    else url = '/favicon_virgool.ico';

    var link = document.querySelector("link[rel~='icon']");
    if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
    }
    link.href = url;
}

export const localizer = {
    getLogo,
    getTitle,
    setFavIcon
}