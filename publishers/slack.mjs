import request from 'request'

function requestCallback (e, res, body) {
  if (e) throw(e)
}

function publish (message) {
  const title = `new message by ${message.name ? `${message.name}@${message.service}` : message.service} - ${message.message}`
  const body = {
    attachments: [
      {
        fallback: title,
        title,
        author_name: message.name || null,
        author_icon: message.icon || null,
        text: message.message,
        footer: message.service,
        footer: message.service_icon || null,
        color: process.env.EGS_PUB_SLACK_COLOR || "#36a64f"
      }
    ]
  }
  request({
    uri: process.env.EGS_PUB_SLACK_INCOMMING_HOOK_URI,
    method: 'POST',
    body
  }, requestCallback)
}

export function regist (publisher) {
  publisher.on('message', message => {
    publish(message)
  })
}
