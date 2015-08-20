# Inga

## Summary

Inga is light and extensible reactive application framework using [RxJS](https://github.com/Reactive-Extensions/RxJS) and [virtual-dom](https://github.com/Matt-Esch/virtual-dom).

## Simple Example

```javascript
var Inga = require("inga");

Inga.define({
  domRoot:"#app",
  dataSource:new Inga.ActionStateStream({
    initialState:{clickCount:0}
  }),
  virtualView:function(ctx){
    return h("button", {
      "ev-click":function(ev){
        ctx.action.emitUpdater(function(state){
          state.clickCount++;
	});
      }
    }, ctx.state.clickCount);
  }
});
```

## Using plugin

You can combine some interesting stuff to status by adding `plugins` to data source.

```javascript
var Inga = require("inga");

Inga.define({
  domRoot:"#app",
  dataSource:new Inga.ActionStateStream({
    initialState:{scrollPos:{x:0, y:0}},
    // plugin 'scroll-pos' combines 'scrollPos' to status object.
    plugins:[
      {module:require("inga/plugins/scroll-pos"), options:{combine:true}}
    ]
  }),
  virtualView:function(ctx){
    return h("div", [
      h("p", "x = " + ctx.state.scrollPos.x),
      h("p", "y = " + ctx.state.scrollPos.y)
    ]);
  }
});
```

About other plugin, see plugins directory.


## Combine your own source

`Gate` class has it's own default stream, but implementing `combine` action, you can extend it with your own source.

```javascript
var Rx = require("rx");
var Inga = require("inga");

Inga.define({
  domRoot:"#app",
  dataSource:new Inga.ActionStateStream({
    initialState:{width:window.innerWidth},
    actions:{
      // extend default stream by your own source.
      combine:function(initial_state, upstream$){
        var width$ = new Rx.Observable.fromEvent(window, "resize")
          .debounce(250)
          .map(function(event){
          return window.innerWidth
        })
        .startWith(window.innerWidth);

        return upstream$.combineLatest(width$, function(state, width){
          state.width = width;
          return state;
        });
      }
    }
  }),
  virtualView:function(ctx){
    return h("p", "current window width = " + ctx.state.width);
  }
});
```

## Do something after stream created.

If defined, `action` method is called after data source stream is defined.

```javascript
var Inga = require("inga");

Inga.define({
  domRoot:"#app",
  dataSource:new Inga.ActionStateStream({
    initialState:{clickCount:0},
    actions:{
      // add subscriber for debug.
      action:function(initial_state, $upstream){
        $upstream.subscribe(function(state){
	  console.log("current state:", state);
	});
      }
    }
  }),
  virtualView:function(ctx){
    return h("button", {
      "ev-click":function(ev){
        ctx.action.emitUpdater(function(state){
          state.clickCount++;
	});
      }
    }, ctx.state.clickCount);
  }
});
```

## Other examples

See `example` directory.

## License

MIT
