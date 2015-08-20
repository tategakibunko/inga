## Summary

Define hash locaiton stream.

## Dependencies

- [jquery](http://jquery.com)
- [jquery-hashchange-plugin](http://benalman.com/projects/jquery-hashchange-plugin/)

jquery-hashchange-plugin is required to handle hashchange events in IE.

## Example

```javascript
var Inga = require("inga");

Inga.define({
  domRoot:"#app",
  dataSource:new Inga.ActionStateStream({
    initialState:{location:""},
    plugins:[
      {
        module:require("inga/plugins/hash-location"),
	options:{
	  // if you want stream only, set this false.
	  combine:true
	}
      }
    ]
  }),
  virtualView:function(ctx){
    return h("p", "location = " + ctx.state.location);
  }
});
```
