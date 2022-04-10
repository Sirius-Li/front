const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

const netErrorToast = () => {
  wx.showToast({
    title: '网络错误',
    icon: 'error'
  })
}

const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

const strIsEmpty = str => (str.replace(/(^\s*)|(\s*$)/g, "").length === 0)
const strIsNumeric = str => str.match(/\d+/)

const formatTime2 = (time) => {
  const rawTime = new Date(time)
  time = `${rawTime.getFullYear()}/`
   + `${(rawTime.getMonth() + 1).toString().padStart(2, '0')}/`
   + `${rawTime.getDate().toString().padStart(2, '0')} `
   + `${rawTime.getHours().toString().padStart(2, '0')}:`
   + `${rawTime.getMinutes().toString().padStart(2, '0')}:`
   + `${rawTime.getSeconds().toString().padStart(2, '0')}`
  return time
}

const validatemobile = (newname) => {
  if (newname.length === 0) {
      return false;
  }
  if (newname.length !== 11) {
      return false;
  }
  var PATTERN_CHINAMOBILE = /^1(3[4-9]|5[012789]|8[23478]|4[7]|7[8])\d{8}$/; //移动号
  var PATTERN_CHINAUNICOM = /^1(3[0-2]|5[56]|8[56]|4[5]|7[6])\d{8}$/; //联通号
  var PATTERN_CHINATELECOM = /^1(3[3])|(8[019])\d{8}$/; //电信号
  if (PATTERN_CHINAUNICOM.test(newname)) {
      return true;
  } else if (PATTERN_CHINAMOBILE.test(newname)) {
      return true;
  } else if (PATTERN_CHINATELECOM.test(newname)) {
      return true;
  }else {
      return false;
  }
}

const validateStudentID = (id) => {
  if (id.length === 0) {
    return false
  }
  if (id.length > 15) {
    return false
  }
  var PATTERN_ID = /^[0-9a-zA-Z]+$/
  return PATTERN_ID.test(id)
}

module.exports = {
  formatTime,
  netErrorToast,
  uuidv4,
  strIsEmpty, strIsNumeric,
  formatTime2,
  validatemobile,
  validateStudentID
}