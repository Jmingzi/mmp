const CATE_LIST_NAME = 'todo__cate'
const LIST_UN_COMPLETE = 'todo__list--unComplete'
const LIST_COMPLETE = 'todo__list--complete-wrap'
const TARGET_NAME = 'target-line'

let itemHeight = 41
let listWrapElem = null
let listOldElemChilds = null
let finalIndex = 0
// 目标容器的名称
let endElemParentName = null
let cateSurroundIndex = 0
const elemMap = {}

const targetLine = document.createElement('div')
targetLine.classList.add(TARGET_NAME)

function beforeAdd() {
  listWrapElem = null
  listOldElemChilds = null
}

function addTargetLine(pageX, pageY, originNode) {
  if (!listWrapElem && !listOldElemChilds) {
    listWrapElem = originNode.parentNode
    listOldElemChilds = Array.from(listWrapElem.childNodes)
  }
  const rect = getBoxArea(pageX, pageY)
  if (rect) {
    endElemParentName = rect.name
    // console.log(endElemParentName)
    const { top } = rect
    const arr = String((pageY - top) / itemHeight).split('.')
    const dot = arr[1] ? Number(`0.${arr[1]}`) : 0
    const dir = dot >= 0 && dot < 0.5 ? 'before' : 'after'
    finalIndex = dir === 'after' ? (Number(arr[0]) + 1) : arr[0]

    if (listWrapElem.classList.contains(rect.name)) {
      // 相同的父容器才可以添加目标线
      insert(targetLine)
      // 把surround去掉
      removeTargetSurround(CATE_LIST_NAME)
    } else if (isSupportSurround()) {
      // 不一致的时候 支持任务拖拽到清单
      addTargetSurround(endElemParentName, finalIndex)
      // 把target line 去掉
      removeTargetLine()
    } else {
      // console.log('remove')
    }
  }
}

function removeTargetLine() {
  listWrapElem && targetLine.remove()
}

function insert(node) {
  if (finalIndex === listOldElemChilds.length) {
    listWrapElem.appendChild(node)
  } else {
    listWrapElem.insertBefore(node, listOldElemChilds[finalIndex])
  }
}

let boxAreaMap = null
function getBoxArea(x, y) {
  if (!boxAreaMap) {
    boxAreaMap = {
      [CATE_LIST_NAME]: document.querySelector(`.${CATE_LIST_NAME}`).getBoundingClientRect(),
      [LIST_UN_COMPLETE]: document.querySelector(`.${LIST_UN_COMPLETE}`).getBoundingClientRect(),
      [LIST_COMPLETE]: document.querySelector(`.${LIST_COMPLETE}`).getBoundingClientRect()
    }
  }

  const key = Object.keys(boxAreaMap).find(key => {
    const { left, top, width, height } = boxAreaMap[key]
    return (
        x > left &&
        y > top &&
        x < (left + width) &&
        y < (top + height)
    )
  })
  return boxAreaMap[key] ? Object.assign({ name: key }, boxAreaMap[key].toJSON()) : null
}

function updateSort(elem) {
  if (
      listWrapElem &&
      listOldElemChilds &&
      listWrapElem.classList.contains(endElemParentName)
  ) {
    // 相同的容器才支持排序
    insert(elem)
    return {
      container: listWrapElem,
      sort: Array.from(listWrapElem.childNodes).map(x => x.dataset.index)
    }
  } else if (isSupportSurround()) {
    // 不同的容器支持任务移动
    return {
      target: elemMap[CATE_LIST_NAME].childNodes[finalIndex]
    }
  }
  return null
}

function addTargetSurround(wrapName, index) {
  cateSurroundIndex = index
  if (!elemMap[wrapName]) {
    elemMap[wrapName] = document.querySelector(`.${wrapName}`)
  }
  let target
  const cls = 'category-item__content--target'
  Array.from(elemMap[wrapName].childNodes).forEach((child, i) => {
    target = child.childNodes[0]
    if (i === Number(index)) {
      target.classList.add(cls)
    } else {
      target.classList.remove(cls)
    }
  })
}

function removeTargetSurround(wrapName, index = cateSurroundIndex) {
  if (elemMap[wrapName] && elemMap[wrapName].childNodes.length) {
    const cls = 'category-item__content--target'
    const target = elemMap[wrapName].childNodes[index]
    target && target.childNodes[0] && target.childNodes[0].classList.remove(cls)
  }
}

// 满足右侧任务拖拽到左侧清单
function isSupportSurround() {
  return listWrapElem &&
      /todo__list/.test(Array.from(listWrapElem.classList).join('')) &&
      endElemParentName === CATE_LIST_NAME
}
