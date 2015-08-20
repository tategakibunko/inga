## Summary

Define tag_input event stream.

## Example

```javascript
var Inga = require("inga");

Inga.define({
  domRoot:"#app",
  dataSource:new Inga.ActionStateStream({
    initialState:{tags:[]},
    plugins:[
      {
        module:require("inga/plugins/tag-input")
      }
    ],
    actions:{
      action:function(initial_state, upstream$){
        this.getPlugins("tag-input").subscribe(function(tag_event){
          tag_event.target.value = ""; // clear input area
    
          // update state
          this.emitUpdater(function(state){
            state.tags.push(tag_event.tag_name);
          });
        }.bind(this));
      }
    }
  }),
  virtualView:function(ctx){
    return h("input", {
      "ev-keydown":function(ev){
        ctx.action.getPlugin("tag-input").emitKeydown(ev);
      },
      "ev-keyup":function(ev){
        ctx.action.getPlugin("tag-input").emitKeyup(ev);
      }
    });
  }
});
```
