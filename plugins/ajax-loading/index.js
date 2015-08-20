/**
 create ajax loading hook.

 [name]
   ajax-loading

 [combine]
   loading:<bool>
 */
var Rx = require("rx");

module.exports = (function(){
  var __stream$;

  return {
    subscribe : function(fn){
      __stream$.subscribe(fn);
    },
    define : function(initial_state){
      __stream$ = this.fromEventEmitter("loading").startWith(false);

      // loading hook
      $.ajaxSetup({
	beforeSend:function(){
	  this.emit("loading", true);
	}.bind(this),
	complete:function(){
	  this.emit("loading", false);
	}.bind(this)
      });

      return __stream$;
    },
    combine : function(state, loading){
      state.loading = loading;
      return state;
    }
  };
})();
