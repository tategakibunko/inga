## Summary

Define scroll position stream.

## Dependencies

[jquery](http://jquery.com)

## Example

```javascript
var Inga = require("inga");

Inga.define({
  domRoot:"#app",
  dataSource:new Inga.ActionStateStream({
    initialState:{scrollPos:{x:0, y:0}},
    plugins:[
      {
        module:require("inga/plugins/scroll-pos"),
	options:{
	  // if you want stream only, set this false.
	  combine:true
	}
      }
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

