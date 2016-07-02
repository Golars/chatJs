
// function sendSoc(data) {
//     $.ajax({
//         type: 'POST',
//         url: '/api/login/soc',
//         data: data,
//         success: function(res) {
//             console.log(res);
//             var response = JSON.parse(res);
//             $('#uid').val(response.uid);
//             if(!response.pay_form) {
//                 window.location.href = response.goto;
//                 return;
//             }
//             $('#modal.modal_popup').addClass('small_popup');
//             $.fancybox.update();
//             $('#form_pay_div').html(response.pay_form);
//             $('#form_pay_div form').append('<input class="submit_btn submit_pay" type="submit" name="submit_pay" value="оплатить">');
//             $('#form_pay_div form input[type=image]').remove();
//             $(".front").removeClass("right").addClass("left");
//             $('#uid').val(response.user.id);
//             $("#registration").hide();
//             $(".enter").hide();
//             $(".enter_content").hide();
//             $(".registration_content").hide();
//             $(".front").addClass("pay");
//             $(".payment_content").show();
//             $(".card_img").hide();
//             return false;
//         },
//         error: function(res){
//             console.log(res);
//             return false;
//         }
//     });
// }

console.log(VK.init({ apiId: 5523900, scope: 'email'}));
VK.init({ apiId: 5523900, scope: 'email'});
function authInfo(response) {
    if (response.session) {
        console.log(response.session);
        socket.emit('auth', {
            token: response.session.sid,
            soc_user_id: response.session.user.id,
            first_name: response.session.user.first_name,
            type: 1
        });
        socket.on('auth', function (data) {
            if(data.status == 200) {
                return socket.emit('activate',{pass:'123'});
            }
        })
        // sendSoc({
        //     token: response.session.sid,
        //     soc_user_id: response.session.user.id,
        //     first_name: response.session.user.first_name,
        //     last_name: response.session.user.last_name,
        //     login: 'VK' + response.session.user.nickname,
        //     email: 'id' + response.session.user.id + '-99999999999@vkmessenger.com',
        //     type: 1,
        //     user_invite_id: $('#user_invite_id').val()
        // });
    }
}

$(document).ready(function(){
    console.log('INIT');
    $('#vk').on('click', function(){
        VK.Auth.login(authInfo, 65539)
    });
});

var token = '';
var user = {};
var chats = [];
var socket = io.connect(
    'http://127.0.0.1:5555/',
    //'http://192.168.1.110:1993/',
    {
        'reconnect': true,
        'reconnection delay': 1000,
        'transports': ['websocket']
    }
);
socket.inChat = '';
socket.on('newMessage', function () {
    console.log('newMessage');
});
socket.on('connectToChat', function () {
    console.log('connectToChat');
});
socket.on('connect', function () {
    console.log('connect');
    $('#status').html('Connect');
    //socket.emit('checkAuth', {hash: hash, salt: sjcl.codec.base64.toBits( sald ), nodecode: [sald, socket.id]});
});

socket.on('newEvent', function (data) {
    console.log('newEvent');
});

socket.on('open', function () {
    console.log('open');
});
socket.on('disconnect', function () {
    $('#status').html('Disconnect');
});
socket.on('close', function () {
    $('#status').html('Сlose');
});

// (function(){
//
//     var debug = false;
//
//     // ***************************************************************************
//     // Socket.io events
//     // ***************************************************************************
//
//     var socket = io.connect(window.location.host);
//
//     // Connection established
//     socket.on('connected', function (data) {
//         console.log(data);
//
//         // Get users connected to mainroom
//         socket.emit('getUsersInRoom', {'room':'MainRoom'});
//
//         if (debug) {
//             // Subscription to rooms
//             socket.emit('subscribe', {'username':'sergio', 'rooms':['sampleroom']});
//
//             // Send sample message to room
//             socket.emit('newMessage', {'room':'sampleroom', 'msg':'Hellooooooo!'});
//
//             // Auto-disconnect after 10 minutes
//             setInterval(function() {
//                 socket.emit('unsubscribe', {'rooms':['sampleroom']});
//                 socket.disconnect();
//             }, 600000);
//         }
//     });
//
//     // Disconnected from server
//     socket.on('disconnect', function (data) {
//         var info = {'room':'MainRoom', 'username':'ServerBot', 'msg':'----- Lost connection to server -----'};
//         addMessage(info);
//     });
//
//     // Reconnected to server
//     socket.on('reconnect', function (data) {
//         var info = {'room':'MainRoom', 'username':'ServerBot', 'msg':'----- Reconnected to server -----'};
//         addMessage(info);
//     });
//
//     // Subscription to room confirmed
//     socket.on('subscriptionConfirmed', function(data) {
//         // Create room space in interface
//         if (!roomExists(data.room)) {
//             addRoomTab(data.room);
//             addRoom(data.room);
//         }
//
//         // Close modal if opened
//         $('#modal_joinroom').modal('hide');
//     });
//
//     // Unsubscription to room confirmed
//     socket.on('unsubscriptionConfirmed', function(data) {
//         // Remove room space in interface
//         if (roomExists(data.room)) {
//             removeRoomTab(data.room);
//             removeRoom(data.room);
//         }
//     });
//
//     // User joins room
//     socket.on('userJoinsRoom', function(data) {
//         console.log("userJoinsRoom: %s", JSON.stringify(data));
//         // Log join in conversation
//         addMessage(data);
//
//         // Add user to connected users list
//         addUser(data);
//     });
//
//     // User leaves room
//     socket.on('userLeavesRoom', function(data) {
//         console.log("userLeavesRoom: %s", JSON.stringify(data));
//         // Log leave in conversation
//         addMessage(data);
//
//         // Remove user from connected users list
//         removeUser(data);
//     });
//
//     // Message received
//     socket.on('newMessage', function (data) {
//         console.log("newMessage: %s", JSON.stringify(data));
//         addMessage(data);
//
//         // Scroll down room messages
//         var room_messages = '#'+data.room+' #room_messages';
//         $(room_messages).animate({
//             scrollTop: $(room_messages).height()
//         }, 300);
//     });
//
//     // Users in room received
//     socket.on('usersInRoom', function(data) {
//         console.log('usersInRoom: %s', JSON.stringify(data));
//         _.each(data.users, function(user) {
//             addUser(user);
//         });
//     });
//
//     // User nickname updated
//     socket.on('userNicknameUpdated', function(data) {
//         console.log("userNicknameUpdated: %s", JSON.stringify(data));
//         updateNickname(data);
//
//         msg = '----- ' + data.oldUsername + ' is now ' + data.newUsername + ' -----';
//         var info = {'room':data.room, 'username':'ServerBot', 'msg':msg};
//         addMessage(info);
//     });
//
//     // ***************************************************************************
//     // Templates and helpers
//     // ***************************************************************************
//
//     var templates = {};
//     var getTemplate = function(path, callback) {
//         var source;
//         var template;
//
//         // Check first if we've the template cached
//         if (_.has(templates, path)) {
//             if (callback) callback(templates[path]);
//         // If not we get and compile it
//         } else {
//             $.ajax({
//                 url: path,
//                 success: function(data) {
//                     source = data;
//                     template = Handlebars.compile(source);
//                     // Store compiled template in cache
//                     templates[path] = template;
//                     if (callback) callback(template);
//                 }
//             });
//         }
//     }
//
//     // Add room tab
//     var addRoomTab = function(room) {
//         getTemplate('js/templates/room_tab.handlebars', function(template) {
//             $('#rooms_tabs').append(template({'room':room}));
//         });
//     };
//
//     // Remove room tab
//     var removeRoomTab = function(room) {
//         var tab_id = "#"+room+"_tab";
//         $(tab_id).remove();
//     };
//
//     // Add room
//     var addRoom = function(room) {
//         getTemplate('js/templates/room.handlebars', function(template) {
//             $('#rooms').append(template({'room':room}));
//
//             // Toogle to created room
//             var newroomtab = '[href="#'+room+'"]';
//             $(newroomtab).click();
//
//             // Get users connected to room
//             socket.emit('getUsersInRoom', {'room':room});
//         });
//     };
//
//     // Remove room
//     var removeRoom = function(room) {
//         var room_id = "#"+room;
//         $(room_id).remove();
//     };
//
//     // Add message to room
//     var addMessage = function(msg) {
//         getTemplate('js/templates/message.handlebars', function(template) {
//             var room_messages = '#'+msg.room+' #room_messages';
//             $(room_messages).append(template(msg));
//         });
//     };
//
//     // Add user to connected users list
//     var addUser = function(user) {
//         getTemplate('js/templates/user.handlebars', function(template) {
//             var room_users = '#'+user.room+' #room_users';
//             // Add only if it doesn't exist in the room
//             var user_badge = '#'+user.room+' #'+user.id;
//             if (!($(user_badge).length)) {
//                 $(room_users).append(template(user));
//             }
//         });
//     }
//
//     // Remove user from connected users list
//     var removeUser = function(user) {
//         var user_badge = '#'+user.room+' #'+user.id;
//         $(user_badge).remove();
//     };
//
//     // Check if room exists
//     var roomExists = function(room) {
//         var room_selector = '#'+room;
//         if ($(room_selector).length) {
//             return true;
//         } else {
//             return false;
//         }
//     };
//
//     // Get current room
//     var getCurrentRoom = function() {
//         return $('li[id$="_tab"][class="active"]').text();
//     };
//
//     // Get message text from input field
//     var getMessageText = function() {
//         var text = $('#message_text').val();
//         $('#message_text').val("");
//         return text;
//     };
//
//     // Get room name from input field
//     var getRoomName = function() {
//         var name = $('#room_name').val().trim();
//         $('#room_name').val("");
//         return name;
//     };
//
//     // Get nickname from input field
//     var getNickname = function() {
//         var nickname = $('#nickname').val();
//         $('#nickname').val("");
//         return nickname;
//     };
//
//     // Update nickname in badges
//     var updateNickname = function(data) {
//         var badges = '#'+data.room+' #'+data.id;
//         $(badges).text(data.newUsername);
//     };
//
//     // ***************************************************************************
//     // Events
//     // ***************************************************************************
//
//     // Send new message
//     $('#b_send_message').click(function(eventObject) {
//         eventObject.preventDefault();
//         if ($('#message_text').val() != "") {
//             socket.emit('newMessage', {'room':getCurrentRoom(), 'msg':getMessageText()});
//         }
//     });
//
//     // Join new room
//     $('#b_join_room').click(function(eventObject) {
//         var roomName = getRoomName();
//
//         if (roomName) {
//             eventObject.preventDefault();
//             socket.emit('subscribe', {'rooms':[roomName]});
//
//         // Added error class if empty room name
//         } else {
//             $('#room_name').addClass('error');
//         }
//     });
//
//     // Leave current room
//     $('#b_leave_room').click(function(eventObject) {
//         eventObject.preventDefault();
//         var currentRoom = getCurrentRoom();
//         if (currentRoom != 'MainRoom') {
//             socket.emit('unsubscribe', {'rooms':[getCurrentRoom()]});
//
//             // Toogle to MainRoom
//             $('[href="#MainRoom"]').click();
//         } else {
//             console.log('Cannot leave MainRoom, sorry');
//         }
//     });
//
//     // Remove error style to hide modal
//     $('#modal_joinroom').on('hidden.bs.modal', function (e) {
//         if ($('#room_name').hasClass('error')) {
//             $('#room_name').removeClass('error');
//         }
//     });
//
//     // Set nickname
//     $('#b_set_nickname').click(function(eventObject) {
//         eventObject.preventDefault();
//         socket.emit('setNickname', {'username':getNickname()});
//
//         // Close modal if opened
//         $('#modal_setnick').modal('hide');
//     });
//
// })();
