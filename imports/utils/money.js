export function money_filter(num, digit) {
  if (!num && num !== 0) return null;
  // const arr = []
  // let type = 0
  // num = Number(num)
  // if (num < 0) {
  //   num = -num
  //   type = 1
  // }
  // num = tofixed_decimal(num, digit)
  // const l = num.split('.')[0]
  // const r = num.split('.')[1] || ''
  // let fLen = l.length % 3 // 整数长度%3的余数
  // fLen = fLen || 3 // 首次需要截取的长度
  // const len = Math.ceil(l.length / 3) // 截取的次数
  // for (let i = 0; i < len; i++) {
  //   if (i === 0 && fLen !== 0) {
  //     arr.push(l.substr(0, fLen))
  //   } else {
  //     arr.push(l.substr(fLen + (i - 1) * 3, 3))
  //   }
  // }
  // let result = arr.join(',')
  // if (r) result = arr.join(',') + '.' + r
  // if (type === 1) result = '-' + result
  // return result

  

  const decimalPlaces = 2 // 取小數後2位

  return Number(Number(num).toFixed(decimalPlaces)).toLocaleString()
}

export function tofixed_decimal(num, digit) {
  if (!num && num !== 0) return null;
  if (!digit) return num.toString();
  if (typeof num !== "number") {
    num = Number(num)
  }
  return num.toFixed(digit)
}

export function supplementZero(num, digit) {
  num = Number(num).toString()
  const l = num.split('.')[0]
  let r = num.split('.')[1] || []
  if (r.length < digit) {
    for (let i = r.length; i < digit; i++) {
      r += '0'
    }
    return l + '.' + r;
  } else {
    return num
  }
}
