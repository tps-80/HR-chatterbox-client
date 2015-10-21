var app = {
  server: 'https://api.parse.com/1/classes/chatterbox',
  onScreenMessages: {},
  init: function(){
    var context = this;
    $('.submit').on('click', function(){ 
      context.handleSubmit();
    });

    this.fetch();
  },

  send: function(message){

    //collect text from textbox
      // send it

    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message');
      }
    });
  },

  fetch: function(){
    var context = this;
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'GET',
      data: '-createdAt',
      contentType: 'application/json',
      success: function (data) {
        // console.log(data);
        // console.log(this);
        // iterate over messages
        for (var i = 0; i < data.results.length; i++) {
          // this.addMessage(message)
          //if the message doesn't exist yet on the page, add it

          if (!context.onScreenMessages[data.results[i].objectId]){
            context.addMessage(data.results[i]);
            context.onScreenMessages[data.results[i].objectId] = true;
          }
        }
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message');
      }
    });    
  },

  addMessage: function(message){
    var messageDiv = $('<div class="chat"></div>');
    var username = $('<span class="user">' + message.username + ' - </span>');
    var messageText = $('<span class="msgText">' + message.text + '</span>');
    messageDiv.append(username);
    messageDiv.append(messageText);
    $('#chats').prepend(messageDiv);
  },

  clearMessages: function(){
    $('#chats').children().remove();
  },

  handleSubmit: function(){
    var room = $('#roomSelect').val();
    var username = _.last(window.location.search.split('='));
    var messageText = $('.msgText').val();

    var msgObj = {
      roomname : room,
      username : username,
      text : messageText
    }

    this.send(msgObj);

  }

};


$(document).ready(function(){
  app.init();
  setInterval(function(){app.fetch();console.log('test')}, 2000);
})



// var test = {
//   createdAt: "2015-10-20T19:30:31.800Z",
//   friends: {},
//   ObjectobjectId: "6LxEom676f",
//   opponents: {},
//   Objectroomname: "TESTROOM",
//   text: "Woot Woot!",
//   updatedAt: "2015-10-20T19:30:31.800Z",
//   username: "MrManu"
// };








































































































































// var app = {
//   server: 'https://api.parse.com/1/classes/chatterbox',
//   rooms: {},
//   friends: [],
//   currentRoom: "global",
//   init: function() {
//     var context = this;
//     $('.submit').on('click', function(){
//       context.handleSubmit();
//     });

//     $('#roomSelect').change(function() {
//       context.currentRoom = $(this).val();
//       context.clearMessages();
//       context.fetch();
//     });

//     setInterval(function() {
//       context.fetch();
//     }, 4000);
//   },

//   handleSubmit: function() {
//     var context = this;
//     var username = _.last(window.location.search.split('='));
//     var roomName = $('#roomSelect').val();
//     var text = $('.msgText').val();
//     var message = {
//       username: username,
//       roomname: roomName,
//       text: text
//     }
//     context.send(message);
//   },

//   send: function(message) {
//     var context = this;
//     $.ajax({
//       url: 'https://api.parse.com/1/classes/chatterbox',
//       type: 'POST',
//       data: JSON.stringify(message),
//       contentType: 'application/json',
//       success: function (data) {
//         console.log('chatterbox: Message sent');
//         console.log(data);
//         _.extend(message, data);
//         context.addMessage(message);
//       },
//       error: function (data) {
//         console.error('chatterbox: Failed to send message');
//       }
//     });
//   },

//   fetch: function(){
//     var context = this;
//     $.ajax({
//       url: 'https://api.parse.com/1/classes/chatterbox',
//       type: 'GET',
//       data: '-createdAt',
//       contentType: 'application/json',
//       success: function (data) {
//         //console.log(data);

//         // default show all messages
//         // if message has a room, only show messages from that room
//         for (var i = 0; i < data.results.length; i++) {

//           if (data.results[i].text) {
//             var tmp = data.results[i].roomname;
//             if (tmp){
//               var lowerTmp = tmp.toLowerCase();
//               if (!context.rooms[lowerTmp]) {
//                 context.rooms[lowerTmp] = tmp;
//                 context.addRoom(tmp);
//               }
//               if (context.currentRoom === "global") {
//                 context.addMessage(data.results[i]);
//               } else if (context.currentRoom === lowerTmp) {
//                 context.addMessage(data.results[i]);
//               }
//             }
//           }

//         }
        
//       },
//       error: function (data) {
//         console.error('chatterbox: Failed to get messages');
//       }
//     });
//   },

//   clearMessages: function(){
//     $('#chats').children().remove();
//   },

//   addMessage: function(message){
//     var context = this;
//     if ($('#' + message.objectId).length === 0) {
//       var msgDiv = $('<div class="chat" id="' + message.objectId + '"></div>');
//       var text = $('<p class="text">' + _.escape(message.text) + '</p>');
//       var user = $('<a class="username">User: ' + message.username + '</a>');
//       user.on('click', function() {
//         context.addFriend(message.username);
//       });
//       msgDiv.append(user);
//       msgDiv.append(text); 
//       $('#chats').prepend(msgDiv);
//     }
//   },

//   addRoom: function(roomName) {
//     $('#roomSelect').append('<option value="' + roomName.toLowerCase() + '">' + roomName + '</option>');
//   },

//   addFriend: function(username) {
//     var context = this;
//     if (context.friends.indexOf(username) === -1) {
//       context.friends.push(username);
//     }
//   }
// };

// $('document').ready(function() {app.init();})