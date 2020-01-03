
var matchmaker = (function(){var f = {};
//============================================================================================================================
    var player_master_list = [];
    var player_list = [];
    f.matched_list = [];
//============================================================================================================================ 
    f.initialize = function(){
        setInterval(pair_match,500);
    };
    f.join_match =function(player_profile){
           var player_data = [];
           var player_id = id_generator(30);
           var player_battle_status = "waiting";
           var player_room = data.get_value("player_room",player_profile);
           player_data.push(["player_id",player_id]);
           player_data.push(["player_profile",player_profile]);
           player_data.push(["battle_id",""]);
           player_data.push(["player_battle_status",player_battle_status]);
           player_data.push(["player_room",player_room]);
           player_list.push(player_data);
           player_master_list.push(player_data);
           //console.log("player_list " + player_list.length + " " +  player_list);
           //console.log("player master_list " + player_master_list.length + " " +  player_master_list);
           return ["",player_id];
    };
    f.cancel_match = function(match_id){
            var player_list_id = "";
            var i = 0;
            for(; i < player_list.length;i++){
                player_list_id = data.get_value("player_id",player_list[i]);
                if(player_list_id === match_id[1]){
                    player_master_list_controller(match_id[1],"set","player_battle_status","canceled");
                    player_list.splice(i,1);
                    break;
                };
            };
            
            //console.log("player_list " + player_list.length + " " +  player_list);
            //console.log("player master_list " + player_master_list.length + " " +  player_master_list);
    };
    
    function pair_match(){
       if(player_list.length >= 2){
           
            var player1 = [];
            var player2 = [];
            var result = false;
            
            var i1 = 0;
            for(; i1 < player_list.length;i1++){
                var player1_room = data.get_value("player_room",player_list[i1]);
                var player1_battle_status = data.get_value("player_battle_status",player_list[i1]);
                if(player1_battle_status === "waiting"){
                    player1 = player_list[i1];
                };
                //console.log("pair match 1>>> " + player1);
                var i2 = 0;
                for(; i2 < player_list.length;i2++){
                    var player2_room = data.get_value("player_room",player_list[i2]);
                    if(i2 !== i1 && player2_room === player1_room){
                        var player2_battle_status = data.get_value("player_battle_status",player_list[i2]);
                        if(player2_battle_status === "waiting"){
                            player2 = player_list[i2];
                        };
                        //console.log("pair match 2>>> " + player2);
                        result = detect_match([i1,player1],[i2,player2]);
                        if(result === true){
                            pair_match();
                            break;  
                        };
                    };
                };
                    
            };
       };
       
        
    };
    function detect_match(player1data,player2data){
        var player1_id = data.get_value("player_id",player1data[1]);
        var player2_id = data.get_value("player_id",player2data[1]);

        if(player_list.length > 2){
            player_list.splice(player1data[0],1);
            //console.log("detect match player_list " + player_list.length + " " +  player_list);
            player_list.splice(player2data[0],1);
            //console.log("detect match player_list " + player_list.length + " " +  player_list);
        }else if(player_list.length <= 2){
            player_list = [];
            //console.log("detect match player_list " + player_list.length + " " +  player_list);
        };
        
        var battle_id = start_match(player1_id,player2_id);
        matchmaker.matched_list.push([battle_id,[player1_id,player2_id]]);
        
        return true;
    };
    function player_master_list_controller(player_id,mode,target,value){
        //console.log("master list controller " + player_id + " >> " + mode + " " + target + " " + value);
        var player_data = [];
        
        var player_master_list_id = "";
        var i = 0;
        for(; i < player_master_list.length;i++){
            player_master_list_id = data.get_value("player_id",player_master_list[i]);
            if(player_master_list_id === player_id){
                    player_data = player_master_list[i];
                    break;
            };
        };
        
        switch(mode){
            case "get":
                return data.get_value(target,player_data);
            break;
            case "set":
                data.set_value(target,player_data,value);
            break;
        };
    };
    function start_match(player1_id,player2_id){
        //console.log("start match " + player1_id + " " + player2_id);
        var battle_id = id_generator(20);

        player_master_list_controller(player1_id,"set","player_battle_status","ongoing");
        player_master_list_controller(player2_id,"set","player_battle_status","ongoing");
        player_master_list_controller(player1_id,"set","battle_id",battle_id);
        player_master_list_controller(player2_id,"set","battle_id",battle_id);
        
        var player1_profile = player_master_list_controller(player1_id,"get","player_profile");
        var player2_profile = player_master_list_controller(player2_id,"get","player_profile");
        
        var initial_data = [
                                ["battle_id",battle_id],
                                ["player1_id",player1_id],
                                ["player1_profile",player1_profile],
                                ["player2_id",player2_id],
                                ["player2_profile",player2_profile]
                           ];
        
        enginecore.insert_battle(initial_data);
        
        return battle_id;
        
    };
    
    f.check_match = function(match_id){
        return player_master_list_controller(match_id[1],"get","battle_id");
    };
//============================================================================================================================
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
var enginecore = (function(){var f = {};

f.battle_session_data = [];

//============================================================================================
f.initialize = function(){
    setInterval(periodic_detection,500);
};

f.insert_battle = function(initial_data){
    
    var battle_data = [];
    
    var player1_profile = data.get_value("player1_profile",initial_data);
    var player2_profile = data.get_value("player2_profile",initial_data);
    
    //=======================
    battle_data.push(["battle_id",data.get_value("battle_id",initial_data)]);
    //
    battle_data.push(["battle_status","ongoing"]);
    battle_data.push(["battle_time",0]);
    battle_data.push(["battle_gameover_wait",0]);
    //=======================
    battle_data.push(["player1_id",data.get_value("player1_id",initial_data)]);
    //When USING PROFILE dont add Number like player1_name instead just use player_name;
    battle_data.push(["player1_name",data.get_value("player_name",player1_profile)]);
    //
    battle_data.push(["player1_image","./ONLINE_Media/Images/hero01.jpg"]);
    battle_data.push(["player1_unit",0]);
    battle_data.push(["player1_health",1000]);
    battle_data.push(["player1_damage",0]);
    //=======================
    battle_data.push(["player2_id",data.get_value("player2_id",initial_data)]);
    //When USING PROFILE dont add Number like player1_name instead just use player_name;
    battle_data.push(["player2_name",data.get_value("player_name",player2_profile)]);
    //
    battle_data.push(["player2_image","./ONLINE_Media/Images/hero01.jpg"]);
    battle_data.push(["player2_unit",0]);
    battle_data.push(["player2_health",1000]);
    battle_data.push(["player2_damage",0]);
    //=======================
    
    enginecore.battle_session_data.push(battle_data);
};

f.update_player_data = function(match_id,player_data){
    
    var player_damage = data.get_value("player_unit",player_data);
    player_data_actions("set",match_id,"unit",player_damage);
    
    
};
f.battle_data = function(mode,match_id,target,value){
        //var allowed_targets = ["judgement","left","right","leftcontrol","rightcontrol"];
        //if(allowed_targets.indexOf(target) !== -1 ){
            var battle_data = get_match_battle_data(match_id[0]);
            //console.log("Battle Data >>> " + mode + " " + match_id + " " + target + " " + value + " >>> " + battle_data);
            switch(mode){
                case "get":
                    try{
                        return data.get_value(target,battle_data);
                    }catch(e){
                        console.log(target + ">>> " + battle_data);
                    };
                break;
                case "set":
                    try{
                        data.set_value(target,battle_data,value);
                    }catch(e){
                        console.log(target + ">>> " + battle_data);
                    };
                break;
            };
        //};
        
    };
//============================================================================================

    function player_data_actions(mode,match_id,target,value){
            switch(mode){
                case "get":
                    return player_battle_data('get',match_id,target);
                break;
                case "set":
                    player_battle_data('set',match_id,target,value);
                break;
            };
        //};
        
    };
    
    function player_battle_data(mode,match_id,target,value){
        var match_battle_data = get_match_battle_data(match_id[0]); //Send Battle Id
 
        var player1_id = data.get_value("player1_id",match_battle_data);
        var player2_id = data.get_value("player2_id",match_battle_data);
        var player_target = "";
        
        if(match_id[1] === player1_id){
            player_target = "player1_";
        }else if(match_id[1] === player2_id){
            player_target = "player2_";
        };
        
        var data_target = player_target.concat(target);

        switch(mode){
            case "get":
                return data.get_value(data_target,match_battle_data);
            break;
            case "set":
                data.set_value(data_target,match_battle_data,value);
            break;
        };

    };

    function get_match_battle_data(battle_id){
        var target_battle_id = "";
        var i = 0;
        for(; i <= enginecore.battle_session_data.length - 1;i++){
            target_battle_id = data.get_value("battle_id",enginecore.battle_session_data[i]);
            if(battle_id === target_battle_id){
                return enginecore.battle_session_data[i];
                break;
            };
        };
        
        return [];
    };
//============================================================================================
function periodic_detection(){
        //console.log("periodic combat detect running...");
        var battle_session_status = "";
        var battle_time = 0;
        var pdc_i = 0;
        for(; pdc_i <= enginecore.battle_session_data.length - 1;pdc_i++){
            var target_battle_data = enginecore.battle_session_data[pdc_i];
            battle_session_status = data.get_value('battle_status',target_battle_data);
            if(battle_session_status !== "gameover"){
                
                battle_time = data.get_value('battle_time',target_battle_data);
                battle_time++;
                data.set_value('battle_time',target_battle_data,battle_time);
                battle_time = data.get_value('battle_time',target_battle_data);
                
                combat_start(target_battle_data);
                
            };
        };
    };

    function combat_start(battle_session){
        
        var judgement = battle_judgement(battle_session);
                    
        if(judgement === "continue"){

            //PRECOMBAT HP
            var player1health_precombat = data.get_value('player1_health',battle_session);
            var player2health_precombat = data.get_value('player2_health',battle_session);
                
            var combat_result = [];
            var combat_battle_session_data = data.copy_array(battle_session);
            combat_result = combat.start(combat_battle_session_data);
                    
            var player1health_postcombat = combat_result[0];
            var player2health_postcombat = combat_result[1];
            
            var raw_damage_player1 = player1health_postcombat - player1health_precombat;
            var raw_damage_player2 = player2health_postcombat - player2health_precombat;
                
            var player1damage = data.number_to_string(raw_damage_player1);
            var player2damage = data.number_to_string(raw_damage_player2);
                    
            //console.log(" combat " +  combat_result);
                    
            data.set_value("player1_health",battle_session,player1health_postcombat);
            data.set_value("player2_health",battle_session,player2health_postcombat);
            data.set_value("player1_damage",battle_session,player1damage);
            data.set_value("player2_damage",battle_session,player2damage);
    
        }else if(judgement === "player1_winner" || judgement === "player2_winner" || judgement === "player_draw"){
            var battle_gameover_wait = data.get_value('battle_gameover_wait',battle_session);
            var battle_time = data.get_value('battle_time',battle_session);
            if(battle_gameover_wait === 0){
                data.set_value('battle_status',battle_session,judgement);
                //MUST BE 1 OR ELSE IT WILL CAUSE ERROR IN MATCHMAKING
                battle_gameover_wait = battle_time + 1;
                data.set_value('battle_gameover_wait',battle_session,battle_gameover_wait);
            }else if(battle_gameover_wait !== 0){
                if(battle_time === battle_gameover_wait){
                    data.set_value('battle_status',battle_session,"gameover");
                };
            };
        };
    
    };

    function battle_judgement(battle_session){
    
        var player1health = data.get_value("player1_health",battle_session);
        var player2health = data.get_value("player2_health",battle_session);
                
        if(player1health >= 1 && player2health <= 0){
            //console.log("END BATTLE DATA >> " + battle_sessions);
            return "player1_winner";
        }else if(player2health >= 1 && player1health <= 0){
            //console.log("END BATTLE DATA >> " + battle_sessions);
            return "player2_winner";
        }else if(player1health <= 0 && player2health <= 0){
            
            if(player1health > player2health ){
                return "player1_winner";
            }else if(player2health > player1health){
                return "player2_winner";
            }else if(player1health === player2health){
                return "player_draw";
            };
            
        };
        
        return "continue";
                    
                    
    
    };

return f;}());var combat = (function(){var f = {};
    
    var combat_session_data = [];
    
    f.start = function(battle_session_data){
            combat_session_data = data.copy_array(battle_session_data);
            
            combat_engine();
            
            var player1_health = data.get_value("player1_health",combat_session_data);
            var player2_health = data.get_value("player2_health",combat_session_data);
      
            return [player1_health,player2_health];
      
      
    };
    
    function combat_engine(){
        
        var player1_health = data.get_value("player1_health",combat_session_data);
        var player2_health = data.get_value("player2_health",combat_session_data);
        var player1_unit = data.get_value("player1_unit",combat_session_data);
        var player2_unit = data.get_value("player2_unit",combat_session_data);
            
        player1_health = player1_health - player2_unit;
        player2_health = player2_health - player1_unit;
            
        data.set_value("player1_health",combat_session_data,player1_health);
        data.set_value("player2_health",combat_session_data,player2_health);
        
    };
    

return f;}());
var data = (function(){var f = {};

f.copy_array = function(target_array){
    //THIS FUNCTION DOES NOT MUTATE/AFFECT THE TARGET ARRAY AND CREATE A NEW INSTANCE OF NEW ARRAY
    var new_array = [];
    
    new_array = target_array.map(function(target_data){
       if(typeof(target_data) !== 'object'){
           return target_data;
       }else if(typeof(target_data) === 'object'){
           var new_target_array = [];
           try{ new_target_array = data.copy_array(target_data);  }catch(e){return target_data;};
           return new_target_array;
       };
        
    });
       
    return new_array;
};

f.combine_array = function(target,value){
    var new_array = [];
    target.map(function(target){new_array.push(target); });
    value.map(function(target){new_array.push(target); });
    return new_array;
};

f.removedatafromarray = function(target,array){
    var newarray = [];
    var i = 0;
    for(;i < array.length;i++){
        if(array[i] !== target){newarray.push(array[i]);};
    };
    return newarray;
};
f.removedatafromarray_usingid = function(id,array){
    var newarray = [];
    var i = 0;
    for(;i < array.length;i++){
        if(i !== id){newarray.push(array[i]);};
    };
    return newarray;
};
f.find = function(target,thearray){
    var i = 0;
    for(; i < thearray.length; i++){
        if(thearray[i][0] === target){
            return i;
        };
    };
    return -1; // -1 = not found;
    
};
f.find_singlevalue = function(target,thearray){
    var i = 0;
    for(; i < thearray.length; i++){
        //console.log("find " + target + " >> "+ thearray[i][0]);
        if(thearray[i] === target){
            //console.log("find now " + target + " >> " + thearray[i][0] + " >> "+ i);
            return i;
        };
    };
    return -1; // -1 = not found;
    
};
f.get_value = function(target,thearray){
    var i = 0;
    for(; i < thearray.length; i++){
        
        if(thearray[i][0] === target){
              return thearray[i][1];
        };
    };
};
f.set_value = function(target,thearray,value){
    var i = 0;
    for(; i < thearray.length; i++){
        if(thearray[i][0] === target){
              thearray[i][1] = value;
        };
    };
    return thearray;
};

f.combine_text = function(textarray){
    var combinetext = "";
    var i = 0;
    for(; i < textarray.length; i++){
        combinetext = combinetext.concat(textarray[i]);
    };
    return combinetext;
};


f.get_list = function(array){
    var unit_list = [];
    var i = 0;
    for(;i < array.length;i++){
        unit_list.push(array[i][0]);
    };
    //console.log("units >> " + unit_list);
    return unit_list;
};

f.concat_list = function(array,mode,seperator){
    var concat_txt = "";
    var i = 0;
    for(;i < array.length;i++){
        switch(mode){
            case "seperate":
                concat_txt = concat_txt.concat(array[i] + seperator);
            break;
            default:
                concat_txt = concat_txt.concat(array[i]);
            break;
        };
        
    };
    return concat_txt;
};
f.rng = function(min,max){
        var max2 = max + 1;
        var rng_value = Math.floor(Math.random() * Math.floor(max2));
        if(rng_value < min){rng_value = min;};
        //console.log("rng " + min + " | " + max + " " + " " + rng_value);
        
        
        
        
        return rng_value;
};

f.number_to_string = function(value){
    if(value >= 0){
        var txt1 = value.toString();
        var txt2 = "+";
        var txt3 = txt2.concat(txt1);
        return txt3;
    }else if(value < 0){
        var txt4 = value.toString();
        return txt4;
    };
};



return f;}());
/*
 * THIS PART MUST ALWAYS BE LAST
 */

var online_core = {};
online_core.matchmaker = matchmaker;
online_core.enginecore = enginecore;
online_core.combat = combat;
online_core.data = data;

module.exports = online_core;