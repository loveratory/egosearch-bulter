import request from 'request'

function requestCallback (e, res, body) {
  if (e) throw(e)
}

function publish (message) {
  const title = `new message by ${message.user_id ? `${message.user_id}@${message.service}` : message.service} - ${message.origin}`
  const body = {
    attachments: [
      {
        fallback: title,
        pretext: message.origin,
        author_name: message.user_name || null,
        author_icon: message.user_icon || null,
        text: message.message,
        footer: message.service,
        footer_icon: message.service_icon || null,
        ts: message.timestamp || null,
        color: process.env.EGS_PUB_SLACK_COLOR || "#36a64f"
      }
    ]
  }
  request({
    uri: process.env.EGS_PUB_SLACK_INCOMMING_HOOK_URI,
    method: 'POST',
    body: JSON.stringify(body)
  }, requestCallback)
}

export default function regist (publisher) {
  publisher.on('message', message => {
    publish(message)
  })
}
