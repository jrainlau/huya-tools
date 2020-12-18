let lock = false

class Block {
  static init () {
    Block.createBlockList()
    Block.createBlockBtns()
    
    const targetNode = document.querySelector('.live-list')
    const config = { childList: true }
    const callback = function(mutationsList, observer) {
        for(const mutation of mutationsList) {
          if (mutation.type === 'childList' && !lock) {
            Block.createBlockBtns()
          }
        }
    }
    const observer = new MutationObserver(callback)
    if (targetNode) {
      observer.observe(targetNode, config)
    }
    console.log('【虎牙助手】加载完毕')
  }

  static createBlockBtns () {
    lock = true
    const blockList = JSON.parse(localStorage.getItem('blockList') || '[]')
    const liveItems = Array.from(document.querySelectorAll('.game-live-item'))

    if (liveItems.length) {
      liveItems.forEach(item => {
        const name = item.querySelector('.nick').innerHTML
        const uniqUrl = item.querySelector('.video-info ').href
        const blockBtn = document.createElement('button')
        blockBtn.classList.add('block-btn')
        blockBtn.innerHTML = '拉黑该主播'
        blockBtn.addEventListener('click', () => {
          const avatar = item.querySelector('.avatar').querySelector('img').src
          blockList.push({ avatar, name, uniqUrl })
          localStorage.setItem('blockList', JSON.stringify(blockList))
          location.reload()
        })
        item.appendChild(blockBtn)

        blockList.forEach(block => {
          if (block.uniqUrl === uniqUrl) {
            item.classList.add('block-this-anchor')
          }
        })
      })
    }
    lock = false
  }

  static createBlockList () {
    const blockList = JSON.parse(localStorage.getItem('blockList') || '[]')
    const blockListInstance = document.querySelector('.block-list-wrap')
    if (blockListInstance) {
      document.body.removeChild(blockListInstance)
    }
    const blockListItems = blockList.map(item => `
      <li class="block-list-item">
        <a class="block-link href="${item.uniqUrl}">
          <img class="block-avatar" src="${item.avatar}" >
          <span class="block-name">${item.name}</span>
        </a>
        <button class="block-btn" data-uniq-url="${item.uniqUrl}">移出黑名单</button>
      </li>
    `).join('')

    const blockListElement = document.createElement('div')
    blockListElement.classList.add('block-list-wrap')
    blockListElement.innerHTML = `<div class="block-list-title">主播黑名单</div><ul class="block-list">${blockListItems}</ul>`
    document.body.appendChild(blockListElement)

    blockListElement.addEventListener('click', e => {
      if (e.target.classList.contains('block-btn')) {
        const { uniqUrl } = e.target.dataset
        const newBlockList = blockList.filter(item => item.uniqUrl !== uniqUrl)
        localStorage.setItem('blockList', JSON.stringify(newBlockList))
        location.reload()
      }
    })
  }
}

Block.init()
