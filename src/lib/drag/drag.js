class Drag {
  constructor (options) {
    if (!options.selector) {
      console.log('selector is must')
      return
    }

    this.options = options
    this.bind()
  }

  bind () {
    let moveAble = false,
        zIndex = 1,
        clientRect,
        moveElem,
        startDiffLeft,
        startDiffTop,
        endLeft,
        endTop
    let dragNode = null

    utils.on('mousedown', document, this.options.selector, (e) => {
      e.stopPropagation()

      const { forbiddenSelector, selector, downCallBack } = this.options
      if (
        forbiddenSelector &&
        e.target.classList.contains(utils.getStringBySelector(forbiddenSelector))
      ) {
        return
      }

      moveAble = true
      moveElem = utils.getParentByClass(e.target, selector)
      clientRect = moveElem.getBoundingClientRect()
      startDiffLeft = e.pageX - clientRect.left
      startDiffTop = e.pageY - clientRect.top
      // console.log('start')

      dragNode = moveElem.cloneNode(true)
      dragNode.style.width = `${clientRect.width}px`
      document.body.appendChild(dragNode)
      downCallBack && downCallBack(dragNode)
    })

    document.addEventListener('mousemove', (e) => {
      e.stopPropagation()

      if (moveAble && moveElem) {
        endLeft = e.pageX - startDiffLeft
        endTop = e.pageY - startDiffTop

        dragNode.style.left = `${endLeft}px`
        dragNode.style.top = `${endTop}px`
        this.options.moveCallBack && this.options.moveCallBack(dragNode, { x: endLeft, y: endTop }, moveElem)
      }
    })

    document.addEventListener('mouseup', (e) => {
      e.stopPropagation()

      if (moveAble && moveElem) {
        this.options.upCallBack && this.options.upCallBack(moveElem)
        document.body.removeChild(dragNode)
        moveAble = false
        moveElem = null
        // console.log('end')
      }
    })
  }
}
