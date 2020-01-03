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