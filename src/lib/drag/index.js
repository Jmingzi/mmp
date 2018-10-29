let itemHeight = 41
let listWrapElem = null
let listOldElemChilds = null
let finalIndex = 0

const targetLine = document.createElement('div')
targetLine.classList.add('target-line')

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
  if (
      rect &&
      listWrapElem.classList.contains(rect.name)
  ) {
    const { top } = rect
    const arr = String((pageY - top) / itemHeight).split('.')
    const dot = arr[1] ? Number(`0.${arr[1]}`) : 0
    const dir = dot >= 0 && dot < 0.5 ? 'before' : 'after'
    finalIndex = dir === 'after' ? (Number(arr[0]) + 1) : arr[0]
    insert(targetLine)
  }
}

function removeTargetLine() {
  listWrapElem && listWrapElem.removeChild(targetLine)
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
      'todo__cate': document.querySelector('.todo__cate').getBoundingClientRect(),
      'todo__list--unComplete': document.querySelector('.todo__list--unComplete').getBoundingClientRect(),
      'todo__list--complete-wrap': document.querySelector('.todo__list--complete-wrap').getBoundingClientRect()
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
  insert(elem)
}
