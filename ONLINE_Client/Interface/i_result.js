var i_result = (function(){ var f = {};
    
    f.initialize = function(){
        
        config.game_status = "judgement";
        config.game_last_location = "result";
        dom.dcl(dom.main_area);

        //Create DIVS
        dom.des("DIV","i_result_div",dom.main_area);
        dom.des("BR","","i_result_div");
        dom.des("DIV","i_result_div_2","i_result_div");
        dom.des("BR","","i_result_div");
        dom.des("DIV","i_result_div_3","i_result_div");
       
        //CREATE TOP
        dom.def("BUTTON","i_result_button_playagain","PLAY AGAIN","i_result_div_3","onclick","i_home.initialize();");
       
        var judgement = data.get_value("battle_status",config.battle_data);
        var your_judgement = "";

        var player1_id = data.get_value("player1_id",config.battle_data);
        var player2_id = data.get_value("player2_id",config.battle_data);
        
        if(config.match_id[1] === player1_id){
            if(judgement === "player1_winner"){
                your_judgement = "victory";
            }else if(judgement === "player2_winner"){
                your_judgement = "defeat";
            }else if(judgement === "player_draw"){
                your_judgement = "draw";
            };
        }else if(config.match_id[1] === player2_id){
            if(judgement === "player1_winner"){
                your_judgement = "defeat";
            }else if(judgement === "player2_winner"){
                your_judgement = "victory";
            }else if(judgement === "player_draw"){
                your_judgement = "draw";
            };
        };

        //CREATE RESULT
        switch(your_judgement){
            case "victory": 
                dom.dec("P","i_result_judgement","DECISIVE VICTORY!","i_result_div_2");
            break;
            case "defeat":
                dom.dec("P","i_result_judgement","DEFEAT!","i_result_div_2");
            break;
            case "draw":
                dom.dec("P","i_result_judgement","DRAW!","i_result_div_2");
            break;
            default:
                 dom.dec("P","i_result_judgement","ERROR: NO RESULT! ","i_result_div_2");
            break;
        };
        
        
    };
    
    
return f;}());