export default class {
  socket () {
    return this.publish
  }

  publish (message) {
    console.log(
      `[${message.service}] new message by ${message.user_id} (${message.origin})`
    )
  }
}
