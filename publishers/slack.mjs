import request from 'request'

export default class {
  socket () {
    return publish
  }
}

function requestCallback (e, res, body) {
  if (e) throw(e)
}

function publish (message) {
  const title = `new message by ${message.user_id}@${message.service}`
  const body = {
    attachments: [
      {
        fallback: `${title} - ${message.origin}`,
        title,
        title_link: message.origin,
        author_name: message.user_name || message.user_id,
        author_icon: message.user_icon || null,
        author_link: message.user_url || null,
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
