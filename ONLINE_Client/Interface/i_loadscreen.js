var i_loadscreen = (function(){var f = {};
    
    f.initialize = function(){
         
        dom.dcl(dom.main_area);

        dom.dec("P","i_loadscreen_txt1","Project ONLINE",dom.main_area);
        dom.des("BR","",dom.main_area);
        dom.dec("P","i_loadscreen_txt2","v0.0.1",dom.main_area);
        dom.des("BR","",dom.main_area);
        dom.dec("P","i_loadscreen_txt4","by",dom.main_area);
        dom.des("BR","",dom.main_area);
        dom.dec("P","i_loadscreen_txt5","Jay C. Angue",dom.main_area);

        setTimeout(i_loadscreen.start,1000);
        
    };
    
    f.start = function(){
        switch(config.game_last_location){
            case "home":
                i_home.initialize();
            break;
            case "battle":
                i_battle.initialize();
            break;
            case "result":
                i_result.initialize();
            break;
            default: 
                i_home.initialize(); 
            break;
        };
    };
    
    
return f;}());