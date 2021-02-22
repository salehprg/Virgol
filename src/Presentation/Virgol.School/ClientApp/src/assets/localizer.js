const getLogo = (type) => {

    if (type.includes('sampad')) return '/sampad.svg';
    if (type.includes('dei')) return '/rahedoor.png';
    return '/logo.svg';

}

const getTitle = (type) => {

    if (type.includes('sampad')) return 'سامانه جامع آموزش مجازی مدارس استعداد های درخشان استان خراسان رضوی';
    if (type.includes('dei')) return 'سامانه آموزش از راه دور استان خراسان رضوی';
    return 'سامانه ویرگول';

}

const setFavIcon = (type) => {

    let url = '';
    if (type.includes('sampad')) url = '/favicon_sampad.ico';
    else if (type.includes('dei')) url = '/favicon_rahedoor.ico';
    else url = '/favicon_virgool.ico';

    var link = document.querySelector("link[rel~='icon']");
    if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
    }
    link.href = url;
}

const getUrl = () => {
    const url = window.location.href;
    if (url.includes('beta')) return 'http://'
}

export const localizer = {
    getLogo,
    getTitle,
    setFavIcon,
    getUrl
}