var Rx = require("rx");
var EventEmitter = require("events").EventEmitter;

module.exports = (function(){
  var __emitter = new EventEmitter(); // protected emitter
  var __plugins = {}; // streams inserted by plugins

  function ActionStateStream(args){
    var initial_state = args.initialState || {};
    var actions = args.actions || {};
    var plugins = args.plugins || [];
    this.state$ = this._define(initial_state, actions, plugins);
  }

  ActionStateStream.prototype.emit = function(event_name, event_value){
    __emitter.emit(event_name, event_value);
  };

  ActionStateStream.prototype.emitUpdater = function(updater){
    this.emit("next-updater", updater);
  };

  ActionStateStream.prototype.fromEventEmitter = function(event_name){
    return new Rx.Observable.fromEvent(__emitter, event_name);
  };

  ActionStateStream.prototype.map = function(fn){
    return this.state$.map(function(state){
      return fn(this.createContext(state));
    }.bind(this));
  };

  ActionStateStream.prototype.createContext = function(state){
    return {action:this, state:state};
  };

  ActionStateStream.prototype.combine = function(initial_state, upstream$){
    return upstream$;
  };
  
  ActionStateStream.prototype.getPlugin = function(name){
    var plugin = __plugins[name] || null;
    if(plugin === null){
      throw new Error("plugin '" + name + "' is not exported.");
    }
    return plugin;
  };

  ActionStateStream.prototype._define = function(initial_state, actions, plugins){

    // extend actions
    for(var action_name in actions){
      ActionStateStream.prototype[action_name] = actions[action_name];
    }

    // create initial stream
    var stream$ = new Rx.BehaviorSubject(initial_state);

    // extend stream with default updater
    var updater$ = this.fromEventEmitter("next-updater");
    stream$ = stream$.combineLatest(updater$.startWith(null), function(state, updater){
      if(updater && typeof updater.__done === "undefined"){
	updater(state);
	updater.__done = true;
      }
      return state;
    });

    // extend stream with plugins
    stream$ = plugins.reduce(function(upstream$, plugin){
      var options = plugin.options || {};
      var module = plugin.module;
      var plugin_stream$ = module.define.call(this, initial_state);
      if(module.name){
	__plugins[module.name] = module;
      }
      return (options.combine && module.combine && plugin_stream$)?
	upstream$.combineLatest(plugin_stream$, module.combine.bind(this)) :
	upstream$;
    }.bind(this), stream$);

    // extend stream with combine of this gate.
    stream$ = this.combine.call(this, initial_state, stream$);

    // do some action if exists.
    if(this.action){
      this.action.call(this, initial_state, stream$);
    }
    return stream$;
  };

  return ActionStateStream;
})();
