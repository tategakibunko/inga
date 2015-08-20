/**
 create hash location stream.

 [name]
   hash-location

 [combine]
   location:<string>
 */
var Rx = require("rx");

// NOTE: this module requires 'jquery' and 'jquery-hash-change-plugin'.
// [jquery] http://jquery.com
// [jquery-hashchange-plugin] http://benalman.com/projects/jquery-hashchange-plugin/
module.exports = (function(){
  var __stream$;
  
  return {
    name : "hash-location",
    subscribe : function(fn){
      __stream$.subscribe(fn);
    },
    define : function(initial_state){
      var first_location = location.hash.replace("#", "");
      var ua = window.navigator.userAgent.toLowerCase();
      var is_ie = (ua.indexOf("msie") !== -1 || ua.indexOf("trident") !== -1);
      var $window = $(window), location$;
      initial_state.location = first_location;
      location$ = new Rx.Observable.fromEvent(window, "hashchange")
	.map(function(event){
	  return location.hash.replace("#", "");
	})
	.startWith(first_location)
      ;
      
      // treat 'hashchange' event in IE
      if(is_ie){
	location$ = this.fromEventEmitter("hashchange")
	  .startWith(first_location)
	;
	$window.hashchange(function(){
	  this.emit("hashchange", location.hash);
	}.bind(this));
	$window.hashchange();
      }
      __stream$ = location$;
      return location$;
    },
    combine : function(state, location){
      state.location = location;
      return state;
    }
  };
})();
