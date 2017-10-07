var socket = io();
socket.on('messages', function(msg){
    console.log("socket.io: "+msg.content+msg.targetUrl);
    $('#socketMessage').append($("<li><a ng-href=\""+msg.targetUrl+"\" ng-click=\"viewMessage("+msg+")\" class=\"ng-binding\" href=\""+msg.targetUrl+"\">"+msg.content+"</a></li>"));
    $('.badge').text(parseInt($('.badge').text()) + 1);
});