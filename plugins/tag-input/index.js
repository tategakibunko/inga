/**
 treat tag input field and key-event and create 'tag_event' stream.

 [name]
   tag-input
 
 [output data]
   {target:<DOMNode>, tag_name:<String>}
*/
var _ = require("lodash");

module.exports = (function(){
  var __stream$, __gate;
  var __back_space = 8;
  var __enter = 13;
  var __space = 32;
  var __colon = 93;

  var __eq = function(value){
    return function(x){
      return x === value;
    };
  };
  
  var __is_tag_splitter = function(down_key, up_key){
    if(!_.find([__enter, __colon, __space], __eq(down_key))){
      return false;
    }
    // is down_key(ENTER or SPACE) is pushed for IME translation?
    if(!_.find([__enter, __space], __eq(down_key)) && down_key !== up_key){
      return false;
    }
    return true;
  };

  return {
    name : "tag-input",
    subscribe : function(fn){
      __stream$.subscribe(fn);
    },
    emitKeydown : function(ev){
      __gate.emit("tag-input", {type:"down", event:ev});
    },
    emitKeyup : function(ev){
      __gate.emit("tag-input", {type:"up", event:ev});
    },
    // Note: call context of define is 'Gate::_define'.
    define : function(initial_state){
      __gate = this;
      __stream$ = this.fromEventEmitter("tag-input")
	.bufferWithCount(2,1)
	.filter(function(ev2){
	  var e1 = ev2[0];
	  var e2 = ev2[1];
	  var key1 = e1.event.keyCode;
	  var key2 = e2.event.keyCode;
	  return (e1.type === "down" && e2.type === "up" && __is_tag_splitter(key1, key2));
	})
	.map(function(ev2){
	  var e1 = ev2[0];
	  var e2 = ev2[1];
	  var tag_name = e2.event.target.value
		.replace(/　/g, "") // cut full size space
		.replace(/[\s\n,]*$/g, "") // cut tail space
	  ;
	  return {target:e2.event.target, tag_name:tag_name};
	})
	.filter(function(tag_event){
	  return tag_event.tag_name !== "";
	});
      return __stream$;
    }
  };
})();
		  
