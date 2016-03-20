#此法用於模塊化,將各部份合成一個exports方便使用,又可以改名
module.exports =
  login: require './login'
  getFunds: require './GET_CAPITAL'
