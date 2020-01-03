(function(f){
    
    f.initialize = function(){
        
        
        config.game_status = "preparing";
        config.game_last_location = "home";
        dom.dcl(dom.main_area);
        
        //CLEAR CONFIGS
        config.match_id = [];
        config.battle_data = [];
        config.player_data = [];
        
        //Create DIVS
        dom.des("DIV","i_home_div",dom.main_area);
        dom.des("BR","","i_home_div");
        dom.des("DIV","i_home_div_3","i_home_div");
        dom.des("BR","","i_home_div");
        dom.des("DIV","i_home_div_4","i_home_div");
        dom.des("BR","","i_home_div");
        dom.des("DIV","i_home_div_5","i_home_div");
        

        //PLAYER INFO
        dom.des("INPUT","i_home_input_playername","i_home_div_3");
        dom.dat("i_home_input_playername","placeholder","Enter Name...");
        dom.dat("i_home_input_playername","maxlength","10");
        //
        var current_name = config.player_name;
        if(current_name === "Empty Name"){current_name = "";};
        dom.dsv("i_home_input_playername",current_name);
        //===========================================
        //PLAYER ROOM
        dom.des("INPUT","i_home_input_playerroom","i_home_div_4");
        dom.dat("i_home_input_playerroom","placeholder","Custom Room...");
        dom.dat("i_home_input_playerroom","maxlength","10");
        //
        var current_room = config.player_room;
        if(current_room === ""){current_room = "";};
        dom.dsv("i_home_input_playerroom",current_room);
        //===========================================
        //START GAME
        dom.def("BUTTON","i_home_button_start","START BATTLE","i_home_div_5","onclick","i_home.start_battle();");
        //==================== PERIODICALLY UPDATE ACCOUNT =======================
        setInterval(update_account,100);
    };
    
    f.start_battle = function(){
        
        var player_name = dom.dgv("i_home_input_playername");
        if(player_name.length <= 0){player_name = "Empty Name";};
        config.player_name = player_name;
        
        var player_room = dom.dgv("i_home_input_playerroom");
        if(player_room.length <= 0){player_room = "";};
        config.player_room = player_room;
        
        i_wait.initialize();

    };
        
    function update_account(){

        if(dom.dge("i_home_input_playername") !== null){
            var player_name = dom.dgv("i_home_input_playername");
            if(player_name.length <= 0){player_name = "Empty Name";};
        
            config.player_name = player_name;

        };
        
        var player_room = dom.dgv("i_home_input_playerroom");
        if(player_room.length <= 0){player_room = "";};
        config.player_room = player_room;
        
    };
   
    
}(this.i_home = {}));