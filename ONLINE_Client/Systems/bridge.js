var bridge = (function(){ var f = {};

    var socket = io();
    
    f.join_match = function(){
 
        var unique_id = id_generator(50);
        var player_initial_data = [
                                       ["player_name",config.player_name],
                                       ["player_room",config.player_room]
                                  ];
                                  
        //setTimeout(function(){config.match_id = matchmaker.join_match(player_initial_data);},1000);
        
        socket.emit('join_match',[unique_id,player_initial_data]);
        
        socket.on(unique_id,function(data){
				
            config.match_id = data;
	});
        
        
    };
    
    f.cancel_match = function(){
        
        //matchmaker.cancel_match(config.match_id);
        
        
        socket.emit('cancel_match',config.match_id);
        
    };
    
    f.start_match = function(){
        
        //setTimeout(function(){config.match_id[0] = matchmaker.check_match(config.match_id);},1000);
        
        
        socket.on(config.match_id[1],function(data){
				
            config.match_id[0] = data;
            
            
	});
        
        
    };
    
    f.request_battle_data = function(){
        
        //setTimeout(function(){config.match_id[0] = matchmaker.check_match(config.match_id);},1000);
        
        
        socket.on(config.match_id[0],function(data){
            
            config.battle_data = [];
            config.battle_data = data;
        
        });
        
        
    };
    
    f.send_player_data = function(){
        
        //matchmaker.cancel_match(config.match_id);
        
        
        socket.emit("player_data",[config.match_id,config.player_data]);
        
    };
    
    function id_generator(id_length){
        var all_characters = ["0","1","2","3","4","5","6","7","8","9","q","w","e","r","t","y","u","i","o","p","a","s","d","f","g","h","j","k","l","z","x","c","v","b","n","m"];
        var full_id = "";
        var randnumber = 0;
        while(id_length > 0){
           id_length--;
           randnumber = data.rng(1,all_characters.length);
           full_id = full_id.concat(all_characters[randnumber-1]);
        };
        return full_id;
    };
    
    
return f;}());