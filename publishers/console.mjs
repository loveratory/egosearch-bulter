export function init (publisher) {
  publisher.on('message', message => {
    console.log(
      `[${message.service}] new message by ${message.user_id} (${message.origin})`
    )
  })
}
