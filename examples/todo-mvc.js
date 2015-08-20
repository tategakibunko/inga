var h = require("virtual-dom/h");
var Inga = require("inga");

document.addEventListener("DOMContentLoaded", function(event){
  Inga.define({
    domRoot:"#app",
    dataSource:new Inga.ActionStateStream({
      initialState:{todos:[], filter:"all"}
    }),
    virtualView:function(ctx){
      var filter = ctx.state.filter;
      var active_todos = ctx.state.todos.filter(function(todo){
	return !todo.done;
      });
      var completed_todos = ctx.state.todos.filter(function(todo){
	return todo.done;
      });
      var selected_todos = ctx.state.todos;
      if(filter === "completed"){
	selected_todos = completed_todos;
      } else if(filter === "active"){
	selected_todos = active_todos;
      }

      return h("div.app", [
	// todo input
	h("div.todo-form", [
	  h("input", {
	    "ev-keyup":function(ev){
	      if(ev.keyCode === 13){
		var id = ctx.state.todos.length + 1; 
		var title = ev.target.value;
		ev.target.value = "";
		ctx.action.emitUpdater(function(state){
		  state.todos.push({
		    id:id,
		    title:title,
		    done:false
		  });
		});
	      }
	    }
	  }),

	  // todo item table
	  h("table.todo-items", selected_todos.map(function(item){
	    return h("tr.todo-item", [
	      h("td", h("input", {
		type:"checkbox",
		checked:item.done,
		"ev-click":function(ev){
		  ctx.action.emitUpdater(function(state){
		    item.done = !item.done;
		  });
		}
	      })),
	      h("td", item.title),
	      h("td", h("button", {
		"ev-click":function(ev){
		  ctx.action.emitUpdater(function(state){
		    state.todos = state.todos.filter(function(todo){
		      return todo !== item;
		    });
		  });
		}
	      }, "delete"))
	    ]);
	  })),

	  // todo footer
	  h("div.todo-footer", [
	    active_todos.length + " left",
	    h("button.select-all" + ((filter === "all")? ".selected" : ""), {
	      "ev-click":function(ev){
		ctx.action.emitUpdater(function(state){
		  state.filter = "all";
		});
	      }
	    }, "All"),
	    h("button.select-active" + ((filter === "active")? ".selected" : ""), {
	      "ev-click":function(ev){
		ctx.action.emitUpdater(function(state){
		  state.filter = "active";
		});
	      }
	    }, "Active"),
	    h("button.select-completed" + ((ctx.state.filter === "completed")? ".selected" : ""), {
	      "ev-click":function(ev){
		ctx.action.emitUpdater(function(state){
		  state.filter = "completed";
		});
	      }
	    }, "Completed"),
	    (completed_todos.length > 0)? h("button.clear-completed", {
	      "ev-click":function(ev){
		ctx.action.emitUpdater(function(state){
		  state.todos = active_todos;
		});
	      }
	    }, "Clear completed") : h()
	  ])
	])
      ]);
    }
  }); // Inga.define
}); // DOMContentLoaded
