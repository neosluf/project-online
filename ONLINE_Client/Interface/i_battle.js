var i_battle = (function(){var f = {};
    
    var update_battle_interface_timer;
    var send_player_data_timer;
    
    f.initialize = function(){

        config.game_last_location = "battle";
        dom.dcl(dom.main_area);

        //Create DIVS
        dom.des("DIV","i_battle_div",dom.main_area);
        dom.des("BR","","i_battle_div");
        dom.des("DIV","i_battle_div_2","i_battle_div");
        dom.des("BR","","i_battle_div");
        dom.des("DIV","i_battle_div_4","i_battle_div");
        
        //Create Interfaces
        interface_player_profile("i_battle_div_2");
        interface_controls("i_battle_div_4");
      
       
        //UNPAUSE MATCH ALWAYS WHEN BATTLE IS INITIALIZED
        initialize_player_data();
        update_battle_interface_timer = setInterval(i_battle.update_battle_interface,100);

    };
    
    
    f.update_battle_interface = function(){
        var battle_status = data.get_value("battle_status",config.battle_data);
        if(battle_status === "ongoing"){
            var player1_image = data.get_value("player1_image",config.battle_data);
            var player2_image = data.get_value("player2_image",config.battle_data);
            var player1_name = data.get_value("player1_name",config.battle_data);
            var player2_name = data.get_value("player2_name",config.battle_data);
            var player1_health = data.get_value("player1_health",config.battle_data);
            var player2_health = data.get_value("player2_health",config.battle_data);
            var player1_damage = data.get_value("player1_damage",config.battle_data);
            var player2_damage = data.get_value("player2_damage",config.battle_data);
            var player1_unit = data.get_value("player1_unit",config.battle_data);
            var player2_unit = data.get_value("player2_unit",config.battle_data);
            
            dom.dat("i_battle_tabletxt_player1_image","src",player1_image);
            dom.dat("i_battle_tabletxt_player2_image","src",player2_image);
            dom.dgi("i_battle_tabletxt_player1_name",player1_name);
            dom.dgi("i_battle_tabletxt_player2_name",player2_name);
            dom.dgi("i_battle_tabletxt_player1_health",player1_health + "( " + player1_damage + " ) ");
            dom.dgi("i_battle_tabletxt_player2_health",player2_health + "( " + player2_damage + " ) ");
            dom.dgi("i_battle_tabletxt_player1_unit",player1_unit);
            dom.dgi("i_battle_tabletxt_player2_unit",player2_unit);
            
            update_controls();
            
        }else if(battle_status === "player1_winner" || battle_status === "player2_winner" || battle_status === "player_draw"){
            end_battle();
        };
            
    };
    
    f.update_unit = function(unit){
        unit = parseInt(unit);
        data.set_value("player_unit",config.player_data,unit);
    };
//***************************************************************************************************************************************
    function update_controls(){
         //
            var player1_id = data.get_value("player1_id",config.battle_data);
            var player2_id = data.get_value("player2_id",config.battle_data);
            var player_color = "";
    
            if(config.match_id[1] === player1_id){
                player_color = "tomato";
            }else if(config.match_id[1] === player2_id){
                player_color = "lightskyblue";
            };
            
            dom.dst("i_battle_table_controls_button00","backgroundColor",player_color);
            dom.dst("i_battle_table_controls_button01","backgroundColor",player_color);
            dom.dst("i_battle_table_controls_button02","backgroundColor",player_color);
            dom.dst("i_battle_table_controls_button10","backgroundColor",player_color);
            dom.dst("i_battle_table_controls_button11","backgroundColor",player_color);
            dom.dst("i_battle_table_controls_button12","backgroundColor",player_color);
    //
    };
    
     function end_battle(){
         clearInterval(update_battle_interface_timer);
         clearInterval(send_player_data_timer);
         i_result.initialize();
     };
     
     function initialize_player_data(){
         
         config.player_data = [
                                  ["player_unit",0]
                              ];
                              
        send_player_data_timer = setInterval(bridge.send_player_data,100);                      
         
     };
//***************************************************************************************************************************************
function interface_player_profile(div_area){
     //CREATE COMBAT TABLE
    dom.des("TABLE","i_battle_table_main",div_area);
    dom.des("TR","i_battle_table_main_tr","i_battle_table_main");
    dom.des("TD","i_battle_table_main_td1","i_battle_table_main_tr");
    dom.des("TD","i_battle_table_main_td2","i_battle_table_main_tr");
    dom.des("DIV","i_battle_tablediv_player1","i_battle_table_main_td1");
    dom.des("DIV","i_battle_tablediv_player2","i_battle_table_main_td2");
    //==================================================================================
    //PLAYER NAME
    dom.des("IMG","i_battle_tabletxt_player1_image","i_battle_tablediv_player1");
    dom.dat("i_battle_tabletxt_player1_image","src","");
     dom.des("IMG","i_battle_tabletxt_player2_image","i_battle_tablediv_player2");
    dom.dat("i_battle_tabletxt_player2_image","src","");
     dom.des("BR","","i_battle_tablediv_player1");
    dom.des("BR","","i_battle_tablediv_player2");
    dom.dec("P","i_battle_tabletxt_player1_name","PLAYER 1","i_battle_tablediv_player1");
    dom.dec("P","i_battle_tabletxt_player2_name","PLAYER 2","i_battle_tablediv_player2");
    dom.des("BR","","i_battle_tablediv_player1");
    dom.des("BR","","i_battle_tablediv_player2");
    dom.dec("P","i_battle_tabletxt_player1_health","00000 ( 0 )","i_battle_tablediv_player1");
    dom.dec("P","i_battle_tabletxt_player2_health","0000 ( 0 )","i_battle_tablediv_player2");
    dom.des("BR","","i_battle_tablediv_player1");
    dom.des("BR","","i_battle_tablediv_player2");
    dom.dec("P","i_battle_tabletxt_player1_unit","000","i_battle_tablediv_player1");
    dom.dec("P","i_battle_tabletxt_player2_unit","000","i_battle_tablediv_player2");
    //=========================================================================================
};
function interface_controls(div_area){
    //CREATE COMBAT TABLE
    dom.des("TABLE","i_battle_table_controls",div_area);
    create_controls_row(1);
    function create_controls_row(row){
        var r = 0;
        for(;r <= row;r++){
            dom.des("TR","i_battle_table_controls_tr"+r,"i_battle_table_controls");
            create_controls_column("i_battle_table_controls_tr",r,2);
        };
    };
    function create_controls_column(row_tag,row_id,column){
        var c_id = "";
        var c_attach = "";
        var c = 0;
        for(;c <= column;c++){
            c_id = data.concat_list([row_id,c]);
            c_attach = data.concat_list([row_tag,row_id]);
            dom.des("TD","i_battle_table_controls_td"+c_id,c_attach);
            var unit = c * 10;
            dom.def("BUTTON","i_battle_table_controls_button"+c_id,unit,"i_battle_table_controls_td"+c_id,"onclick","i_battle.update_unit("+unit+");");
            dom.dat("i_battle_table_controls_button"+c_id,"class","i_battle_table_controls_button");
        };
    };
};
//***************************************************************************************************************************************
   
return f;}());