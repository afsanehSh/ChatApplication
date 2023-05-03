const messageListWrapper = document.getElementById('message-list-wrapper')
const form = document.getElementById('chat-form')
const input = document.getElementById('chat-input')

const socket = io()
let user

function chatMessages() {
    const messageWrapper = document.createElement('div')
    messageWrapper.setAttribute('id', `messages`)
    messageWrapper.classList.add('message-list')
    messageWrapper.addEventListener('scroll', event => {
        const element = event.target
        if (element.scrollTop === 0) {
            loadMessageByScroll(element)
        }
    })
    loadMessage(messageWrapper)
    messageListWrapper.appendChild(messageWrapper)
}

socket.on('user_connected', data => {
    console.log(data)
    user = data
    chatMessages()
})

socket.on('message', data => {
    printMessage(data)
})

form.addEventListener('submit', event => {
    event.preventDefault()

    if (!input.value) {
        return
    }
    socket.emit('groupMessage', {
        message: input.value,
        from: user.id
    })
    input.value = ''
    input.focus()
})

function printMessage(data, type = 'append', scrollElement) {
    const message = document.createElement('div')
    message.classList.add('message')

    const text = document.createElement('div')
    text.textContent = data.message

    const time = document.createElement('div')
    time.textContent = data.createdAt
    time.classList.add('time')

    message.appendChild(text)
    message.appendChild(time)

    message.setAttribute('message-id', data.id)

    if (data.from === user.id) {
        message.classList.add('owner')
    }

    const messages = document.getElementById(`messages`)

    if (type === 'append') {
        messages.appendChild(message)
    } else {
        messages.prepend(message)
    }

    if (scrollElement) {
        scrollElement.scrollIntoView()
    } else {
        message.scrollIntoView()
    }
}

function loadMessage(messageWrapper) {
    if (messageWrapper.childNodes.length) return

    getMessages().then(messages => {
        messages.forEach(message =>
            printMessage(message, 'prepend', messageWrapper.lastChild)
        )
    })
}

function loadMessageByScroll(messageWrapper) {
    const {firstChild} = messageWrapper
    const messageId = firstChild.getAttribute('message-id')

    getMessages({messageId}).then(messages => {
        messages.forEach(message => printMessage(message, 'prepend', firstChild))
    })
}

function getMessages(options) {
    const url =
        `/api/groupMessage?` +
        new URLSearchParams({
            ...options
        })

    return fetch(url).then(res => res.json())
}
