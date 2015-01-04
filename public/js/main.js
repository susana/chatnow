var name;

$(document).ready(function() {
  var socket = io();

  // User

  // Enter

  $('#submit-username').on('click', function() {
    $.ajax({
      type: 'POST',
      url: 'users',
      data: {'username': $('#username').text()},
      success: function(data) {
        name = data.data.username;
        $('#modal-username').addClass('display-none');
      },
      error: function() {

      }
    });
  });

  // Leave

  $(window).on('unload', function() {
    $.ajax({
      type: 'DELETE',
      url: 'users/' + name,
      success: function () {
        socket.emit('chat message', {}); 
      },
      error: function() {

      }
    });

  });

  // Messaging

  socket.on('chat message all', function(data){
    $('#messages').append($('<li>').text(data.username + ": " + data.message));
  });
 
  $('#send').on('click', function() {
    $.ajax({
      type: 'POST',
      url: 'messages',
      data: {username: name, message: $('#message').text()},
      success: function(data) {
        socket.emit('chat message', data.data);
        $('#message').text('');
      },
      error: function() {

      }
    });
  });

  // Init

  $.ajax({
    type: 'GET',
    url: 'messages',
    success: function(data) {
      data.data.messages.forEach(function(e, i) {
        var d = JSON.parse(e);
        $('#messages').append($('<li>').text(d.username + ": " + d.message));
      });
    },
    error: function() {
      
    }
  });


});
