const wsCache = new WebStorageCache()
const USER_KEY = 'MISS_USER_LIST'
const LOGIN_KEY = 'LOGIN'
// const CATEGORY_KEY = 'CATEGORY_KEY'
const LIST_KEY = 'LIST_KEY'
// const LIST_DETAIL_KEY = 'LIST_DETAIL_KEY'

const db = {
  getAllUser() {
    return wsCache.get(USER_KEY) || []
  },

  setAllUser(data) {
    wsCache.set(USER_KEY, data)
  },

  register(user) {
    const all = this.getAllUser()
    const isExist = all.find(x => x.name === user.name)
    if (isExist) {
      return Promise.reject({
        success: false,
        msg: '该用户已存在'
      })
    } else {
      all.push(user)
      this.setAllUser(all)
      return Promise.resolve({
        success: true,
        msg: '注册成功'
      })
    }
  },

  login(user) {
    wsCache.set(LOGIN_KEY, user)
    return Promise.resolve()
  },

  getCurrentUser() {
    return wsCache.get(LOGIN_KEY)
  },

  logout() {
    wsCache.delete(LOGIN_KEY)
    return Promise.resolve()
  },

  getTodoList() {
    return Promise.resolve(wsCache.get(LIST_KEY) || [])
  },

  setTodoList(data) {
    wsCache.set(LIST_KEY, data)
  },

  addTodo(data, currentUser) {
    const id = Date.now()
    return this.getTodoList().then(all => {
      all.push({
        id,
        ...data,
        userName: currentUser.name
      })
      this.setTodoList(all)
      return all[all.length - 1]
    })
  },

  // 修改清单内容
  updateTodo(category) {
    // console.log(category)
    return this.getTodoList().then(all => {
      const itemIndex = all.findIndex(x => x.id === category.id)
      all[itemIndex] = category
      this.setTodoList(all)
      return itemIndex
    })
  },

  // 为清单添加任务
  addSubList(cateId, listObj) {
    return this.getTodoList().then(all => {
      const itemIndex = all.findIndex(x => x.id === cateId)
      let { list } = all[itemIndex]
      if (!list) {
        list = []
      }
      list.unshift({
        id: Date.now(),
        ...listObj
      })
      all[itemIndex].list = list
      this.setTodoList(all)
      return { item: all[itemIndex], index: itemIndex }
    })
  },

  // 修改清单任务内容
  updateSubList(cateId, listObj) {
    return this.getTodoList().then(all => {
      const itemIndex = all.findIndex(x => x.id === cateId)
      const listIndex = all[itemIndex].list.findIndex(x => x.id === listObj.id)
      all[itemIndex].list[listIndex] = listObj
      this.setTodoList(all)
      return { item: all[itemIndex], index: itemIndex }
    })
  },

  // 删除清单任务
  deleteSubList(cateId, listObj) {
    return this.getTodoList().then(all => {
      const itemIndex = all.findIndex(x => x.id === cateId)
      const listIndex = all[itemIndex].list.findIndex(x => x.id === listObj.id)
      // all[itemIndex].list[listIndex] = listObj
      all[itemIndex].list.splice(listIndex, 1)
      this.setTodoList(all)
      return { itemIndex, listIndex }
    })
  }
}