## Summary

Define loading stream which yields `true` when ajax start and `false` when done.

## Dependencies

[jquery](http://jquery.com)

## Sample

```javascript
var Inga = require("inga");

Inga.define({
  domRoot:"#app",
  dataSource:new Inga.ActionStateStream({
    initialState:{loading:""},
    plugins:[
      {
        module:require("inga/plugins/ajax-loading"),
	options:{
	  // if you want stream only, set this false.
	  combine:true
	}
      }
    ]
  }),
  virtualView:function(ctx){
    return h("p", "loading = " + ctx.state.loading);
  }
});

$.get("/path/to/api");
```


