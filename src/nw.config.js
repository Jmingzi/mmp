alert(nw)
if (nw) {
  const path = './'
  const fs = require('fs')

  const reloadWatcher = fs.watch(path, () => {
    location.reload()
    reloadWatcher.close()
  })

  const win = nw.Window.get()

  win.on('close', function(e) {
    this.hide()
    //(mac上菜单中的退出事件)
    if (e === 'quit') {
      win.close(true)
    }
  })

  // 初始化托盘图标
  var tray = new nw.Tray({
    icon: 'icon/icon.icns',
    title: 'miss'
  })

  // 创建菜单
  var menu = new nw.Menu()
  // 添加子菜单
  menu.append(new nw.MenuItem({
    type: 'normal',
    label: '清除缓存',
    click: function(){
      nw.App.clearCache()
    }
  }))
  menu.append(new nw.MenuItem({
    type: 'normal',
    label: '打开控制台',
    click: function(){
      // nw.App.clearCache()
      win.showDevTools()
    }
  }))
  menu.append(new nw.MenuItem({
    type: 'normal',
    label:'退出',
    click: function(){
      tray.remove()
      tray = null
      win.close(true)
      process.exit()
    }
  }))
  tray.menu = menu
  // 点击托盘图标时激活窗体
  tray.on('click',function(){
    win.focus()
    win.show()
  })

  nw.App.on('reopen', function(){
    win.show()
    win.focus()
  })

  document.body.addEventListener('contextmenu', function(ev) {
    // Prevent showing default context menu
    // ev.preventDefault();
    alert(1)
  }, false)
}
