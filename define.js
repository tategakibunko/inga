var h = require("virtual-dom/h");
var diff = require("virtual-dom/diff");
var patch = require("virtual-dom/patch");
var DOMDelegator = require("dom-delegator");

// define action -> state -> view cycle
// @param opt {Object}
// @param opt.domRoot {DOMNode}
// @param opt.dataSource {ActionStateStream}
// @param opt.virtualView {Function} :: context -> virtualDOM
module.exports = function(opt){
  new DOMDelegator(); // required for event handling

  var $dom_root = opt.domRoot || null;
  if($dom_root === null){
    throw new Error("domRoot is not defined");
  }
  if(typeof $dom_root === "string"){
    $dom_root = document.querySelector($dom_root);
  }

  var data_source = opt.dataSource || null;
  if(data_source === null){
    throw new Error("dataSource is not defined");
  }

  var virtual_view = opt.virtualView || null;
  if(virtual_view === null){
    throw new Error("virtualView is not defined");
  }
  
  var $div = document.createElement("div");
  $dom_root.appendChild($div);

  data_source
    .map(virtual_view) // virtualView :: context -> virtualDOM
    .startWith(h())
    .bufferWithCount(2, 1) // len:2, offset:1 => (0,1), (1,2), (2,3), ...
    .subscribe(function(history){
      $div = patch($div, diff(history[0], history[1]));
    });
};
