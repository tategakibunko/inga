/**
 create window width stream.

 [name]
   window-width

 [combine]
   windowWidth:<int>
 */
var Rx = require("rx");

module.exports = (function(){
  var __stream$;

  return {
    name : "window-width",
    subscribe : function(fn){
      __stream$.subscribe(fn);
    },
    define : function(initial_state){
      __stream$ = new Rx.Observable.fromEvent(window, "resize")
	.debounce(250)
	.map(function(ev){
	  return window.innerWidth;
	})
	.startWith(window.innerWidth);
      return __stream$;
    },
    combine : function(state, window_width){
      state.windowWidth = window_width;
      return state;
    }
  };
})();
