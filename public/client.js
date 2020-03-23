$( document ).ready(function() {
  //   global io
  // socket.io already injected by CDN script in chat.pug
  const socket = io()
  
   
  // Form submission with new message in field with id 'm'
  $('form').submit(function(){
    var messageToSend = $('#m').val();
    //send message to server
    socket.emit('chat message', messageToSend)
    // clear text box
    $('#m').val('');
    return false; // prevent form submit from refreshing page
  });
  
  
  socket.on('user', data => {
    $('#num-users').text(data.currentUsers + ' users online')
    let message = data.name
    if (data.conneced) {
      message += ' has joined the chat'
    } else {
      message += ' has left the chat'
    }
    $('#messages').append($('<li>').html('<b>' + message + '<\/b>'))
  })
  
  socket.on('chat message', data => {
    $('#messages')
      .append($('<li>')
      .html('<b>' + data.name + ', ' + data.message+ '<\/b>'))
  })
  
  
});
