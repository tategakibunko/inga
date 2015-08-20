## Summary

Define width of window stream.

## Example

```javascript
var Inga = require("inga");

Inga.define({
  domRoot:"#app",
  dataSource:new Inga.ActionStateStream({
    initialState:{windowWidth:window.innerWidth},
    plugins:[
      {
        module:require("inga/plugins/window-width"),
	options:{
	  // if you want stream only, set this false.
	  combine:true
	}
      }
    ]
  }),
  virtualView:function(ctx){
    return h("div", "width = " + ctx.state.windowWidth);
  }
});
```
