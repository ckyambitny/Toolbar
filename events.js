
var EventType = function(type){
    if(typeof type !== "string"){
        throw new Error("Type must be string");
    }

    Object.defineProperty(this,"type",{
        value : type,
        enumerable : true
    });

    

};
var EventTarget = function() {
    Object.defineProperty(this, "__listeners",{
        value:{}
    });
};

Object.defineProperties(EventTarget.prototype,{
    
    addListener : {
        value : function(type, listener){
            if(typeof this.__listeners[type] === "undefined"){
                this.__listeners[type] = [];
            }
          //alert("Listener added" + " " + type);
            this.__listeners[type].push(listener);
        },
        enumerable : true
    },
    __fire :{
        value : function(evtObj){
        
             if ( !(evtObj instanceof EventType) ) {
                throw new Error("Event object is not of correct type");
            }
            
            if (typeof evtObj.target === "undefined") {
                evtObj.target = this;
            }

            var listeners = this.__listeners[evtObj.type];
            console.log("FIRE Event" + evtObj.type);
            if (typeof listeners === "undefined") {
                return;
            }

            for (var i = 0, len = listeners.length; i < len; i++) {
                    listeners[i].call(this, evtObj);
                
            }
        }
    },//enumerable false!
    removeListener : {
        value : function(type, listener){
            var listeners = this.__listeners[type];
            if (typeof listeners === "undefined") {
                return;
            };

            for (var i = 0, len = listeners.length; i < len; i++) {
                if (listeners[i] === listener) {
                    listeners.splice(i,1);
                    break;
                };
            };
        },
        enumerable : true
    }
});

