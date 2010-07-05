var info = exports,
	agent = navigator.userAgent.toLowerCase();

info.isIPad = Boolean(agent.match('ipad'))
info.isIPod = Boolean(agent.match('ipod'))
info.isIPhone = Boolean(agent.match('iphone'))
info.isAndroid = Boolean(agent.match('android'))

info.isTouch = info.isIPad || info.isIPod || info.isIPhone || info.isAndroid
