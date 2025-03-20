import moment from "moment";

const fileFormat = (url='') => {

    const fileExt = url.split(".").pop()

    if(fileExt === 'mp4' || fileExt === 'webm' || fileExt === 'ogg' || fileExt === 'mov') return 'video';
   
    if(fileExt === 'mp3' || fileExt === 'wav' || fileExt === 'm4a') return 'audio';
   
    if(fileExt === 'jpg' || fileExt === 'png' || fileExt === 'jpeg' || fileExt === 'gif' || fileExt === 'heic') return 'image';

    return 'file'
}

const transformImage = (url='', width='600') => {
 
    const newUrl = url.replace("upload/", `upload/dpr_auto/w_${width}/`)

    return newUrl
}

const getLast7Days = () => {
 const curDate = moment();

 const last7Days = [];

 for (let i = 0; i < 7; i++) {
    const dayDate = curDate.clone().subtract(i, 'days');
    const days = dayDate.format('dddd')
    last7Days.unshift(days);
 }

return last7Days;

}

const getOrSaveFromStorage = ({key, value, get}) => {
if(get) return localStorage.getItem(key)? JSON.parse(localStorage.getItem(key)) : null;
else localStorage.setItem(key, JSON.stringify(value))
}

export { fileFormat, transformImage, getLast7Days, getOrSaveFromStorage };