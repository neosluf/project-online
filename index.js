const online = require('./online_core.js');
const express = require('express');
const path = require('path');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server,{});
const PORT = process.env.PORT || 5000;

//APP
app.use(express.static(path.join(__dirname,'/')));

app.get('/',function(req,res){
	res.sendFile(__dirname + 'index.html');
});

server.listen(PORT,function(){console.log('Listening on ${ PORT }');});

//START SERVER FILES
online.matchmaker.initialize();
online.enginecore.initialize();

//SOCKET
io.sockets.on('connection',function(socket){
	
	//USER CONNECT
	console.log('A socket has connected to the server');
        
	
	//USER SEND
	socket.on('join_match',function(sender_data){
		var player_id = online.matchmaker.join_match(sender_data[1]);
		socket.emit(sender_data[0],player_id);
	});
        
        socket.on('cancel_match',function(match_id){
            online.matchmaker.cancel_match(match_id);	
	});
        
        /*
         * ongoing = 2 PLAYERS ARE ALIVE
         * player1_winner = PLAYER 2 IS DEAD WAITING FOR JUDGEMENT
         * player2_winner = PLAYER 1 IS DEAD WAITING FOR JUDGEMENT
         * gameover = 1 PLAYER IS DEAD
         */
        
        socket.on('player_data',function(sender_data){
                var battle_status = online.enginecore.battle_data("get",sender_data[0],"battle_status");
                if(battle_status === "ongoing"){ online.enginecore.update_player_data(sender_data[0],sender_data[1]); };
	});
        
        clearInterval(run_match_list);
        var run_match_list = setInterval(emit_matched_list,500);
        
        function emit_matched_list(){
            
            var matched_list = online.matchmaker.matched_list;
            var i = 0;
            for(; i <= matched_list.length - 1;i++){
                var battle_id = matched_list[i][0];
                var player1_id = matched_list[i][1][0];
                var player2_id = matched_list[i][1][1];
                var player1_battle_status = online.enginecore.battle_data("get",[battle_id,player1_id],"battle_status");
                var player2_battle_status = online.enginecore.battle_data("get",[battle_id,player2_id],"battle_status");
                if(player1_battle_status !== "gameover"){socket.emit(player1_id,battle_id);};
                if(player2_battle_status !== "gameover"){socket.emit(player2_id,battle_id);};
            };
            
        };
        
        clearInterval(run_battle_data_list);
        var run_battle_data_list = setInterval(emit_battle_data,500);
        
        function emit_battle_data(){
            
            var battle_data_list = online.enginecore.battle_session_data;
            var i = 0;
            for(; i <= battle_data_list.length - 1;i++){
                var battle_id = online.data.get_value("battle_id",battle_data_list[i]);
                var battle_status = online.enginecore.battle_data("get",[battle_id,""],"battle_status");
                if(battle_status !== "gameover"){ socket.emit(battle_id,battle_data_list[i]);};
            };
            
        };
        
        
        
	
	//USER DISCONNECT
	socket.on('disconnect',function(){
		console.log("A user has disconnected to the server");
	});

});

