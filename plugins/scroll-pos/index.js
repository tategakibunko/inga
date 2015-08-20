/**
 create scroll position stream.

 [name]
   scroll-pos

 [combine]
   scrollPos:{x:<int>, y:<int>}
 */
var Rx = require("rx");

module.exports = (function(){
  var __$window = $(window);
  var __stream$;

  return {
    name : "scroll-pos",
    subscribe : function(fn){
      __stream$.subscribe(fn);
    },
    define : function(initial_state){
      __stream$ = new Rx.Observable.fromEvent(window, "scroll")
	.debounce(250)
	.map(function(event){
	  return {
	    x:__$window.scrollLeft(),
	    y:__$window.scrollTop()
	  };
	})
	.startWith({
	  x:__$window.scrollLeft(),
	  y:__$window.scrollTop()
	});
      return __stream$;
    },
    combine : function(state, scroll_pos){
      state.scrollPos = scroll_pos;
      return state;
    }
  };
})();
