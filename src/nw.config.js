if (window.nw) {
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
  menu.append(new nw.MenuItem({
    type: 'normal',
    label: '打开应用',
    click: function(){
      win.focus()
      win.show()
    }
  }))
  menu.append(new nw.MenuItem({
    type: 'normal',
    label: '清除缓存',
    click: function(){
      nw.App.clearCache()
      // location.reload()
      // nw.App.reopen()
      alert('清除缓存后需要重新打开应用才能生效！')
      win.close(true)
      win.open()
    }
  }))
  menu.append(new nw.MenuItem({
    type: 'normal',
    label: '打开控制台',
    click: function(){
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
    ev.preventDefault()
  }, false)
}
