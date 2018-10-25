const wsCache = new WebStorageCache()
const USER_KEY = 'MISS_USER_LIST'
const LOGIN_KEY = 'LOGIN'
// const CATEGORY_KEY = 'CATEGORY_KEY'
const LIST_KEY = 'LIST_KEY'
// const LIST_DETAIL_KEY = 'LIST_DETAIL_KEY'

const { Query, User, init } = AV
const ToDoTable = 'TodoList'
init('iYzWnL2H72jtQgNQPXUvjFqU-gzGzoHsz', 'OR3zEynwWJ7f8bk95AdiGFzJ')
const TodoList = AV.Object.extend(ToDoTable)

const db = {
  register(user) {
    const u = new User()
    u.setUsername(user.name)
    u.setPassword(user.password)
    return u.signUp().then(() => {
      // console.log(loggedInUser)
      return {
        success: true,
        msg: '注册成功'
      }
    }, error => {
      // console.log(error)
      return Promise.reject({
        success: false,
        msg: '该用户已存在'
      })
    })
  },

  login(user) {
    return User.logIn(user.name, user.password).then(loggedInUser => {
      return loggedInUser.toJSON()
      // wsCache.set(LOGIN_KEY, loggedInUser.toJSON())
    }, () => {
      return Promise.reject({ msg: '该用户名不存在' })
    })
  },

  getCurrentUser() {
    const current = User.current()
    if (current) {
      // console.log(current.toJSON())
      return current.toJSON()
    }
    // return wsCache.get(LOGIN_KEY)
    return null
  },

  logout() {
    // wsCache.delete(LOGIN_KEY)
    User.logOut()
    return Promise.resolve()
  },

  getTodoList() {
    const { objectId } = this.getCurrentUser()
    const query = new Query(ToDoTable)
    query.equalTo('userId', objectId)
    query.descending('updatedAt')
    return query.find().then(res => {
      return res.map(x => x.toJSON())
    })
  },

  // setTodoList(data) {
  //   wsCache.set(LIST_KEY, data)
  // },

  // 添加清单
  addTodo(data) {
    const user = this.getCurrentUser()
    const todoSync = new TodoList()
    const reqData = {
      ...data,
      userId: user.objectId,
      userName: user.username
    }
    Object.keys(reqData).forEach(key => {
      todoSync.set(key, reqData[key])
    })
    return todoSync.save().then(res => {
      // console.log(res.toJSON())
      return res.toJSON()
    })
  },

  // 修改清单内容
  updateTodo(data, id) {
    const todo = AV.Object.createWithoutData(ToDoTable, id)
    Object.keys(data).forEach(key => {
      todo.set(key, data[key])
    })
    return todo.save().then(res => {
      return res.toJSON()
    })
  },

  // 删除清单
  deleteList(cateId) {
    const todo = AV.Object.createWithoutData(ToDoTable, cateId);
    return todo.destroy()
  },

  // 为清单添加任务
  // addSubList(cateId, listObj) {
  //   return this.getTodoList().then(all => {
  //     const itemIndex = all.findIndex(x => x.id === cateId)
  //     let { list } = all[itemIndex]
  //     if (!list) {
  //       list = []
  //     }
  //     list.unshift({
  //       id: Date.now(),
  //       ...listObj
  //     })
  //     all[itemIndex].list = list
  //     this.setTodoList(all)
  //     return { item: all[itemIndex], index: itemIndex }
  //   })
  // },

  // 修改清单任务内容
  // updateSubList(cateId, listObj) {
  //   return this.getTodoList().then(all => {
  //     const itemIndex = all.findIndex(x => x.id === cateId)
  //     const listIndex = all[itemIndex].list.findIndex(x => x.id === listObj.id)
  //     all[itemIndex].list[listIndex] = listObj
  //     this.setTodoList(all)
  //     return { item: all[itemIndex], index: itemIndex }
  //   })
  // },

  // 删除清单任务
  // deleteSubList(cateId, listObj) {
  //   return this.getTodoList().then(all => {
  //     const itemIndex = all.findIndex(x => x.id === cateId)
  //     const listIndex = all[itemIndex].list.findIndex(x => x.id === listObj.id)
  //     // all[itemIndex].list[listIndex] = listObj
  //     all[itemIndex].list.splice(listIndex, 1)
  //     this.setTodoList(all)
  //     return { itemIndex, listIndex }
  //   })
  // }
  syncLocal() {
    const HAS_SYNC = 'HAS_SYNC'
    const localList = wsCache.get(LIST_KEY)
    let currentUser = db.getCurrentUser()
    if (
        !wsCache.get(HAS_SYNC) &&
        localList &&
        currentUser
    ) {
      console.log('同步本地数据到数据库')
      localList.forEach(item => {
        const todoSync = new TodoList()
        Object.keys(item).forEach(key => {
          todoSync.set(key, item[key])
        })
        currentUser = currentUser.toJSON()
        todoSync.set('userId', currentUser.objectId)
        todoSync.set('userName', currentUser.username)
        todoSync.save().then(() => {
          console.log(item.name, 'save ok')
        }).catch(() => {
          console.log(item.name, 'save error')
        })
      })
      wsCache.set(HAS_SYNC, 1)
    }
  }
}

