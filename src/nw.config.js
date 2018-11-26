if (window.require) {
  const path = './'
  const fs = require('fs')

  const reloadWatcher = fs.watch(path, () => {
    location.reload()
    reloadWatcher.close()
  })

  const win = nw.Window.get()
  // win.showDevTools()
  // win.on('loading', function() {
    // win.close(true)
    // alert('loading')
  // })

  win.on('close', function(e) {
    this.hide()
    //hide隐藏起来(最小化)
    // win.hide()
    //(mac上菜单中的退出事件)
    if (e === 'quit') {
      win.close(true)
    }
  })

  // var platform = navigator.platform;
  // var isMac = platform == 'Mac68k' || platform == 'MacPPC' || platform == 'Macintosh' || platform == 'MacIntel';
  // var isMac = /Mac68k|MacPPC|Macintosh|MacIntel/i.test(platform)
  // 初始化托盘图标
  var tray = tray = new nw.Tray({
    icon: 'icon/icon.icns',
    title: 'miss-todo'
  })

  // 创建菜单
  var menu = new nw.Menu()
  // 添加子菜单
  menu.append(new nw.MenuItem({
    type: 'normal',
    label: '刷新系统',
    click: function(){
      // win.focus()
      // win.show()
      win.location.reload(true)
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
  // mac上点击dock图标时，reopen事件，激活窗体。否则挂载托盘图标后，dock图标的点击事件失效
  nw.App.on('reopen', function(){
    win.show()
    win.focus()
  })

  // document.body.addEventListener('contextmenu', function(ev) {
  //   // Prevent showing default context menu
  //   ev.preventDefault();
  //   // Popup the native context menu at place you click
  //   todoListMenu.popup(ev.x, ev.y);
  //   return false;
  // }, false);
}
