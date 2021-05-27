/**
 * @returns {string} format: YYMMDD-hhmmss
 */
const d = new Date()
const year = d.getFullYear()
const month = `${d.getMonth() + 1}`.padStart(2, '0')
const day = `${d.getDate()}`.padStart(2, '0')
const hour = `${d.getHours()}`.padStart(2, '0')
const minute = `${d.getMinutes()}`.padStart(2, '0')
const second = `${d.getSeconds()}`.padStart(2, '0')

export const dateFormatCommon = `${year}${month}${day}-${hour}${minute}${second}`

