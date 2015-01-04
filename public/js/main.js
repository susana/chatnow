var socket = io();
      
socket.on('chat message', function(msg){
  $('#messages').append($('<li>').text(msg));
});

$.ajax({
  type: 'GET',
  url: 'messages',
  success: function(data) {
    data.data.messages.forEach(function(e, i) {
      $('#messages').append($('<li>').text(e));
    });
  },
  error: function() {
    
  }
});

$('#send').on('click', function() {
  $.ajax({
    type: 'POST',
    url: 'messages',
    data: {message: $('#message').text()},
    success: function(data) {
      socket.emit('chat message', data.data.message);
      $('#message').text('');
    },
    error: function() {

    }
  });
});

