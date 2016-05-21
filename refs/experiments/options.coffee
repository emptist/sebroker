# login ht
har = require './har'
util = require 'util'
entries = har.log.entries
exp = {}

for each in entries
  for k, v of each when k[0] is 'r'
    (exp[k] ?= []).push v

postheaders = exp.request[0].headers
getheaders = exp.request[1].headers

module.exports =
  postheaders: postheaders
  getheaders: getheaders
