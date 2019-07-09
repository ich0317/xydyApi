/**
 * Created by changliang on 6/22/19.
 */

/**
 * 个位数补0
 * @param {(number|string)}
 */
exports.to0 = n => {
  return n*1 < 10 ? '0'+n : n;
}

/**
 * 时间戳或GMT转时间转换
 * @param {(string | dateGMT),string}
 * timeStamp 时间戳或GMT格式日期
 * format = YMD => 年-月-日 , Y=> 年 , M=>月 , D=>日 , YM => 年-月 , hms=> 时:分:秒 , YMDhms=> 年-月-日 时:分:秒 , YMDhm=> 年-月-日 时:分
 */
exports.stampToTime = (date, format= "YMDhms") => {
  let getDate = null;
  let to0 = n => n*1 < 10 ? '0'+n : n;

  if(Object.prototype.toString.call(date) == '[object Date]'){
    //GMT
    getDate = date;
  }else{
    //时间戳
    getDate = date/100000000000 < 1 ? date* 1000: date;
  }
  
  let oDate = new Date(getDate);
  let Y = oDate.getFullYear();
  let M = to0(oDate.getMonth() + 1);
  let D = to0(oDate.getDate());
  let h = to0(oDate.getHours());
  let m = to0(oDate.getMinutes());
  let s = to0(oDate.getSeconds());

  let oMap = new Map([
    ["Y", Y],
    ["M", M],
    ["D", D],
    ["h", h],
    ["hm", `${h}:${m}`],
    ["hms", `${h}:${m}:${s}`],
    ["YM", `${Y}-${M}`],
    ["YMD", `${Y}-${M}-${D}`],
    ["YMDhms", `${Y}-${M}-${D} ${h}:${m}:${s}`],
    ["YMDhm", `${Y}-${M}-${D} ${h}:${m}`]
  ]);
  return oMap.get(format);
}

/**
 * 时间转时间戳
 */
exports.timeToStamp = time => {
  let newTime = time.replace(/-/g,'/')
  return new Date(newTime).getTime();
}

/**
 * 数组里对象删除相同元素
 * @param {array ,string, [object|string]}
 * arr需要去重的数组  key对象里需要对比的 键 名  obj要对比的对象或者字符串
 */
exports.rmSameObj = (arr, key, obj) => {
  let _obj = obj[key] ? obj[key] : obj;
  let _del = ""

  arr.forEach((v, i) => {
    if (v[key] == _obj) {
        _del = arr.splice(i, 1);
    }
  });
  return _del;
};