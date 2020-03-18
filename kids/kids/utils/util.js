const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}


//字符串转年月日，时分秒   2019-09-04 22:10:10
const stringToTime = (str) => {
  const timeData = {
    year: str.substring(0, 3),
    month: str.substring(5, 7),
    day: str.substring(8, 10),
    hours: str.substring(11, 13),
    minutes: str.substring(14, 16),
    seconds: str.substring(17, 19)
  }
  return timeData
}

const obj2params = (options)=>{
  let paramStr = '';
  for (const item in options) {
    if (options[item]) paramStr += `${item}=${encodeURIComponent(options[item])}&`
  }
  paramStr = paramStr.substring(0, paramStr.length - 1);
  return paramStr
}

const getUrlData =(oldurl,data)=>{
  let url = oldurl
  if (obj2params(data)) {
    url = `${url}?${obj2params(data)}`
  }
  return url
}


const accAdd = (arg1, arg2) =>{
  var r1, r2, m, c;
  try {
    r1 = arg1.toString().split(".")[1].length;
  }
  catch (e) {
    r1 = 0;
  }
  try {
    r2 = arg2.toString().split(".")[1].length;
  }
  catch (e) {
    r2 = 0;
  }
  c = Math.abs(r1 - r2);
  m = Math.pow(10, Math.max(r1, r2));
  if (c > 0) {
    var cm = Math.pow(10, c);
    if (r1 > r2) {
      arg1 = Number(arg1.toString().replace(".", ""));
      arg2 = Number(arg2.toString().replace(".", "")) * cm;
    } else {
      arg1 = Number(arg1.toString().replace(".", "")) * cm;
      arg2 = Number(arg2.toString().replace(".", ""));
    }
  } else {
    arg1 = Number(arg1.toString().replace(".", ""));
    arg2 = Number(arg2.toString().replace(".", ""));
  }
  return (arg1 + arg2) / m;
}

const accMul = (arg1, arg2)=> {
  var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
  try {
    m += s1.split(".")[1].length;
  }
  catch (e) {
  }
  try {
    m += s2.split(".")[1].length;
  }
  catch (e) {
  }
  return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
}

module.exports = {
  formatTime: formatTime,
  stringToTime: stringToTime,
  obj2params: obj2params,
  getUrlData: getUrlData,
   accAdd: accAdd,
  accMul: accMul
}
