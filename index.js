/**
 * Created with JetBrains WebStorm.
 * User: Den
 * Date: 19.10.14
 * Time: 11:07
 * To change this template use File | Settings | File Templates.
 */
var
    path = require('path'),
    fs = require('fs');


function Collection(options){
    this.name = options.name;
    this.fileName = options.fileName;
    this.items = {};
    this.idPropertyName = options.idPropertyName||'_id';
    this.saveImmidiate = options.saveImmidiate || true;
    this.loadSync();
}

Collection.prototype.loadSync = function(){
    var text;
    try {
        text  = fs.readFileSync(this.fileName);
        this.items = JSON.parse(text);
    }catch(e){
        this.items = {};
    }
}

Collection.prototype.saveSync = function(){
    fs.writeFileSync(this.fileName,JSON.stringify(this.items));
}

Collection.prototype.asArray = function(){
    return Object.keys(this.items).map(function(key){
        return this.items[key];
    }.bind(this))
}

Collection.prototype.set = function(id,obj){
    if(!obj) {
        obj = id;
        id = obj[this.idPropertyName];
    }
    if(!id) throw new Error('Object id needed');
    this.items[id] = obj;
    if(this.saveImmidiate) this.saveSync();
}

Collection.prototype.add = Collection.prototype.set;

Collection.prototype.get = function(id){
    return this.item[id];
}

Collection.prototype.update = function(id,obj){
    if(!obj) {
        obj = id;
        id = obj[this.idPropertyName];
    }
    if(!id) throw new Error('Object id needed');
    var target = this.items[id];
    if(!target) throw new Error('Object with id '+id+' not found');
    Object.keys(obj).forEach(function(key){
        target[key] = obj[key];
    });
    if(this.saveImmidiate) this.saveSync();
}

module.exports = Collection;

var
  dataDir = path.join(__dirname,'..','..','data'),
  knownCollections = {};

Collection.setDefaults = function(options){
    dataDir = options.dataDir||dataDir;
}


Collection.factory = function(name){
    return knownCollections[name] ||
        (knownCollections[name] = new Collection({
        name: name,
        fileName: path.join(dataDir,name+'.json')
    }));
}
