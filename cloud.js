var request = require('request')
var md5 = require('js-md5')
var router = require('express').Router();
var AV = require('leanengine');
var SignLog = AV.Object.extend('SignLog');

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function getUrl(username) {
  var url = 'http://s1.zkcserv.com/cb_hrms/index.cfm?event=ionicAction.ionicAction.signInAction&_user_name=' + username + '&_pass_word=A5DD89CC477FE32B264C41CA561D2BE8&_is_login=1&_notification_token=13065ffa4e07eebb75b&_device_type=android'
  return url
}

function getLatitude() {
  var origin = 24.612064;
  return origin + getRandomInt(1, 50) * 0.000001;
}

function getLongitude() {
  var origin = 118.048888;
  return origin + getRandomInt(1, 50) * 0.000001;
}

function getAddress() {
  var addrs = ['福建省厦门市集美区集美北大道', '集美北大道靠近集美软件园(地铁站)', '', '福建省厦门市集美区G15(沈海高速)', '集美北大道靠近集美软件园B区B02'];
  return addrs[getRandomInt(0, addrs.length - 1)]
}

function getCardRecTime(value) {
  var formats = value.split(':');
  var getRandomMinutes = getRandomInt(1, 15);
  var getRandomSeconds = getRandomInt(1, 60);
  if (getRandomSeconds < 10) {
    getRandomSeconds = '0' + getRandomSeconds;
  }
  if (formats[0] === '08') {
    formats[1] = parseInt(formats[1]) - getRandomMinutes;
  } else {
    formats[1] = parseInt(formats[1]) + getRandomMinutes;
  }
  if (formats[1] < 10) {
    formats[1] = '0' + formats[1];
  }
  formats[2] = getRandomSeconds;
  return formats.join(':')
}

function getToken(username) {
  var randomSeed = md5(username || '')
  return randomSeed.substring(6, 22)
}

function sign(userInfo) {
  var sysLog = new SignLog();
  return new Promise(function (resolve, reject) {
    request.post({
      url: getUrl(userInfo.phone),
      form: {
        latitude: getLatitude(),
        longitude: getLongitude(),
        address: getAddress(),
        wifi_value: '',
        wifi_mac: '',
        card_rec_time: getCardRecTime(userInfo.value),
        mobile_token: getToken(userInfo.phone)
      }
    }, function (err, httpResponse, body) {
      sysLog.set('phone', userInfo.phone)
      if (err) {
        sysLog.set('message', err)
        reject();
        console.log(err)
        return;
      } else {
        sysLog.set('message', httpResponse.body)
      }
      if (httpResponse.body.flag != 0) {
        reject();
      } else {
        resolve();
      }
      sysLog.save()
    })
  })
}

/**
 * 一个简单的云代码方法
 */
AV.Cloud.define('hello', function (request) {
  var now = new Date().getHours() + ":" + new Date().getMinutes();
  var userInfo = {
    phone: "18059805239",
    value: now
  };
  sign(userInfo).then(function () {}).catch(function (e) {
    sign(userInfo)
  })
  return 'Hello world!';
});