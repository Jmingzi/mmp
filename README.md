# miss todo

[制作dmg详细教程](https://bbs.feng.com/read-htm-tid-6724285.html)

踩坑记录：

- 当main指定为URL时，需指定node-remote字段允许使用node环境，否则process和nw对象都是`undefined`
- 不同域名之间的跨域请求，最简单的方法时禁止掉chrome的通源策略`"chromium-args": "--disable-web-security"`
