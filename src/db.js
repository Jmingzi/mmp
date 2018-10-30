const wsCache = new WebStorageCache()
// const USER_KEY = 'MISS_USER_LIST'
// const LOGIN_KEY = 'LOGIN'
// const CATEGORY_KEY = 'CATEGORY_KEY'
const LIST_KEY = 'LIST_KEY'
// const LIST_DETAIL_KEY = 'LIST_DETAIL_KEY'

const { Query, User, init } = AV
const ToDoTable = 'TodoList'
const TodoSortTable = 'TodoListSort'
init('iYzWnL2H72jtQgNQPXUvjFqU-gzGzoHsz', 'OR3zEynwWJ7f8bk95AdiGFzJ')
const TodoList = AV.Object.extend(ToDoTable)
const TodoListSort = AV.Object.extend(TodoSortTable)

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
    return null
  },

  logout() {
    User.logOut()
    return Promise.resolve()
  },

  getTodoList() {
    const { objectId } = this.getCurrentUser()
    const query = new Query(ToDoTable)
    query.equalTo('userId', objectId)
    // query.addAscending('sort')
    query.addDescending('createdAt')
    // query.addDescending('sort')  在查询到结果后手动排序
    return query.find().then(res => {
      return res.map(x => x.toJSON())
    })
  },

  // 添加清单
  addTodo(data) {
    const todoSync = new TodoList()
    Object.keys(data).forEach(key => {
      todoSync.set(key, data[key])
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

  syncLocal() {
    const HAS_SYNC = 'HAS_SYNC'
    const localList = wsCache.get(LIST_KEY)
    const currentUser = db.getCurrentUser()
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
        // currentUser = currentUser.toJSON()
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
  },

  // 根据objectId获取排序
  getSortById(id) {
    const query = new Query(TodoSortTable)
    const { objectId } = this.getCurrentUser()
    query.equalTo('pid', id === 0 ? objectId : id)
    return query.find().then(res => {
      return res.length ? res[0].toJSON() : null
    })
  },

  saveSortById(data) {
    const sort = new TodoListSort()
    Object.keys(data).forEach(key => {
      sort.set(key, data[key])
    })
    return sort.save()
  },

  updateSortById(objectId, data) {
    const sort = AV.Object.createWithoutData(TodoSortTable, objectId)
    Object.keys(data).forEach(key => {
      sort.set(key, data[key])
    })
    return sort.save()
  },

  uploadImg(data) {
    return new AV.File(data.name, data).save({
      onprogress(e) {
        data.cb(e.percent)
      }
    })
  },

  deleteImg(objectId) {
    return AV.File.createWithoutData(objectId).destroy().then(res => {
      console.log(res)
    })
  }
}

