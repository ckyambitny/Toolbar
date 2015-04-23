var oojs = (function(oojs) {
    var PvalueChangeEvt = function(type, value){
        EventType.call(this, type);
        
        Object.defineProperty(this,"value",{
            value : value,
            enumerable : true 
        });
    }; 

    PvalueChangeEvt.prototype = Object.create(EventType.prototype);
    
    var ItemAddedEvt = function(item){
        EventType.call(this, "itemadded");
        
        Object.defineProperty(this, "item",{
            value : item,
            enumerable : true
        });
    };
    ItemAddedEvt.prototype = Object.create(EventType.prototype);

    var ItemRemovedEvt = function(index){
        EventType.call(this,"itemremoved");

        Object.defineProperty(this, "index",{
            value : index,
            enumerable : true
        });
    };
    ItemRemovedEvt.prototype = Object.create(EventType.prototype);
   


    var ToolbarItem = function(itemElement){
        EventTarget.call(this);
        Object.defineProperty(this, "__el",{
            value : itemElement
        }); 
    };

    ToolbarItem.prototype = Object.create(EventTarget.prototype, {
        toggleActiveState : {
            value : function(){
                this.activated =! this.activated;
            },
            enumerable : true
        },
        enabled: {
            get: function(){
                return !this.__el.classList.contains("disabled");
            },
            set: function(value){
                var currentValue = this.enabled;
                if (currentValue === value) {
                    return;
                }
                if (value) {
                    this.__el.classList.remove("disabled");
                }else{
                    this.__el.classList.add("disabled");
                };
                
                //alert("Enabled changed, event to fire");

                this.__fire(new PvalueChangeEvt("enabledchanged",value));
            } //enabledchange event fires event
        },
        activated: {
            get: function(){
                return this.__el.classList.contains("active");
            },
            set: function(value){
                var currentValue=this.activated;
                if (currentValue === value) {
                    return;
                }

                if (value) {
                    this.__el.classList.add("active");
                }else{
                    this.__el.classList.remove("active");
                }

                this.__fire(new PvalueChangeEvt("activatedchanged", value));
            }
        }
    });


    var createToolbarItems = function(itemElements) {
        var items=[];
        [].forEach.call(itemElements, function(el, index, array){
            var item= new ToolbarItem(el);
            items.push(item);

        }); 
        return items;
    };

    var Toolbar = function(toolbarElement){
        EventTarget.call(this);
        var items = toolbarElement.querySelectorAll(".toolbar-item");
        Object.defineProperties(this, {
            __el : {
                value: toolbarElement
            },
            items : {
                value : createToolbarItems(items),
                enumerable : true
            }
        });     
    };

    Toolbar.prototype = Object.create(EventTarget.prototype, {
        add : {
            value : function(){
                var newSpanElement=document.createElement("SPAN");
                newSpanElement.classList.add("toolbar-item");
                this.__el.appendChild(newSpanElement);
                var item = new ToolbarItem(newSpanElement);
                this.items.push(item);
                this.__fire(new ItemAddedEvt(item));
            },
            enumerable : true
        },  
        remove :{
            value : function(elementIndex){
                var itemsLength =  this.items.length;
               
                if( isNaN(elementIndex) || elementIndex % 1 != 0 || elementIndex < 0 || elementIndex >= itemsLength ){
                    throw new Error(" Index error: Not a valid number or out of range ");
                }
                var item = this.items[elementIndex];
                this.items.splice(elementIndex,1);
                this.__el.removeChild(item.__el);
                item = null;
                
                this.__fire(new ItemRemovedEvt(elementIndex));
            },
            enumerable : true
        },
        appendTo : {
            value : function(parentElement){
                parentElement.appendChild(this.__el);
                this.__fire({
                    type : "appended",
                    parentElement : parentElement
                });
            },
            enumerable : true
        }


    });
    
    oojs.createToolbar = function (elementId) {
        var element = document.getElementById(elementId);
        if(!element){
            element=document.createElement("DIV");
            element.id=elementId;
            element.classList.add("toolbar");
        }
        return new Toolbar(element);
    };
    return oojs;

}(oojs || {}));


//var toolbar = oojs.createToolbar('myToolbar');




/*
var toolbar = oojs.createToolbar("myToolbar");

var toolbarItem = toolbar.items[0];

toolbarItem.setEnabled(true);
toolbarItem.getEnabled();

toolbarItem.enabled = true;

var enabled = toolbarItem.enabled;
*/