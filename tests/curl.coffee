module.exports =
	curl1: "https://service.htsc.com.cn/service/loginAction.do?method=login"
	curl2: '-H'
	curl3: "Cookie: __utma=249860889.1993829779.1432911006.1440648966.1446029513.4;"
	curl4: "__utmz=249860889.1432911006.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none);"
	curl5: " JSESSIONID=1QTTW2cXpt8CykHQZFp1Vn2m225TZ7dTkqKpT7LWrG2Khc05ZL3s!979201071;"
	curl6: " SESSION_COOKIE=61781"
	curl7: '-H'
	curl8: "Origin: https://service.htsc.com.cn"
	curl9: '-H'
	curl10: "Accept-Encoding: gzip, deflate"
	curl11: '-H'
	curl12: "Accept-Language: en-US,en;q=0.8,zh-TW;q=0.6,zh;q=0.4,zh-CN;q=0.2,en-GB;q=0.2"
	curl13: '-H'
	curl14: "Upgrade-Insecure-Requests: 1"
	curl15: '-H'
	curl16: "User-Agent: Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.125 Safari/537.36"
	curl17: '-H'
	curl18: "Content-Type: application/x-www-form-urlencoded"
	curl19: '-H'
	curl20: "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"
	'''
	-H "Cache-Control: max-age=0"
	-H "Referer: https://service.htsc.com.cn/service/login.jsp"
	-H "Connection: keep-alive"
	-H "DNT: 1"
	--data
	"userType=jy&loginEvent=1&trdpwdEns=2d8c0c21d479305c539e7a49ecd87d4d&macaddr=00-1B-B1-28-38-26&hddInfo=5VEWYCT6&lipInfo=192.168.1.101+&CPU=QkZFQkZCRkYwMDAzMDY2MQ"%"3D"%"3D&PCN=U0RXTS0yMDEzMDkxNFNX&PI=QyxOVEZTLDYwLjAwMzg"%"3D&topath=null&accountType=1&userName=080300007199&servicePwd=19660522&trdpwd=2d8c0c21d479305c539e7a49ecd87d4d&vcode=e554"
	--compressed
	'''
         'userType': self.__user_type,
            'loginEvent': 1,
            'trdpwdEns': self.__encrypted_password,
            'macaddr': self.__mac_addr,
            'hddInfo': self.__harddisk_model,
            'lipInfo': self.__ip_addr,
            'topath': 'null',
            'accountType': 1,
            'userName': self.__account,
            'servicePwd': self.__service_password,
            'trdpwd': self.__encrypted_password,
            'vcode': self.__verify_code
   