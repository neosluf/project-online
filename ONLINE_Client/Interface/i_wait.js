(function(f){
    
    var check_join_match;
    
    var check_start_match;
    
    f.initialize = function(){
        
        dom.dcl(dom.main_area);

        dom.dec("P","i_wait_txt","Finding Match...",dom.main_area);
        dom.des("BR","",dom.main_area);
        dom.def("BUTTON","i_wait_button_cancel","CANCEL BATTLE",dom.main_area,"onclick","i_wait.cancel_match();");

        config.match_id = ["",""];
        bridge.join_match();
       check_join_match = setInterval(join_match_checker,10);

    };
    
    
    
    function join_match_checker(){
        
        if(config.match_id[1] !== ""){
            clearInterval(check_join_match);
            bridge.start_match();
            check_start_match = setInterval(start_match_checker,10);
        };
    };
    
    function start_match_checker(){
        
        if(config.match_id[0] !== ""){
            clearInterval(check_start_match);
            bridge.request_battle_data();
            i_battle.initialize();
        };
    };
    
    f.cancel_match = function(){
        if(config.match_id[1] !== ""){
            clearInterval(check_start_match);
            bridge.cancel_match();
            i_home.initialize();
        };
    };
    
}(this.i_wait = {}));