Object.prototype.forKey = function(cb){
    if(cb) new Error("need a date")
    for(var i in this){
        cb(this[i],i,this);
    }
}