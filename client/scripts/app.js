var app = {
  server: 'https://api.parse.com/1/classes/chatterbox',
  rooms: {},
  friends: [],
  currentRoom: "default",
  init: function() {
    var context = this;
    $('.submit').on('click', function(){
      context.handleSubmit();
    });

    setInterval(function() {
      context.fetch();
    }, 4000);
  },

  handleSubmit: function() {
    var context = this;
    var username = _.last(window.location.search.split('='));
    var roomName = $('#roomSelect').val();
    var text = $('.msgText').val();
    var message = {
      username: username,
      roomname: roomName,
      text: text
    }
    context.send(message);
  },

  send: function(message) {
    var context = this;
    $.ajax({
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
        console.log(data);
        _.extend(message, data);
        context.addMessage(message);
      },
      error: function (data) {
        console.error('chatterbox: Failed to send message');
      }
    });
  },

  fetch: function(){
    var context = this;
    $.ajax({
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'GET',
      data: '-createdAt',
      contentType: 'application/json',
      success: function (data) {
        console.log(data);
        for (var i = 0; i < data.results.length; i++) {

          if (data.results[i].text) {
            var tmp = data.results[i].roomname;
            if (tmp){
              var lowerTmp = tmp.toLowerCase();
              if (!context.rooms[lowerTmp]) {
                context.rooms[lowerTmp] = tmp;
                context.addRoom(tmp);
              }
            }
            context.addMessage(data.results[i]);
          }

        }
        
      },
      error: function (data) {
        console.error('chatterbox: Failed to get messages');
      }
    });
  },

  clearMessages: function(){
    $('#chats').children().remove();
  },

  addMessage: function(message){
    var context = this;
    if ($('#' + message.objectId).length === 0) {
      var msgDiv = $('<div class="chat" id="' + message.objectId + '"></div>');
      var text = $('<p class="text">' + message.text + '</p>');
      var user = $('<a class="username">User: ' + message.username + '</a>');
      user.on('click', function() {
        context.addFriend(message.username);
      });
      msgDiv.append(user);
      msgDiv.append(text); 
      $('#chats').prepend(msgDiv);
    }
  },

  addRoom: function(roomName) {
    $('#roomSelect').append('<option value="' + roomName.toLowerCase() + '">' + roomName + '</option>');
  },

  addFriend: function(username) {
    var context = this;
    if (context.friends.indexOf(username) === -1) {
      context.friends.push(username);
    }
  },

  filterMessages: function(roomName) {

  }

};

$('document').ready(function() {app.init();})