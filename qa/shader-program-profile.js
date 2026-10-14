// Read-only program/source accounting, installed before the application loads.
export function installShaderProgramProfile(){
 const proto=WebGL2RenderingContext.prototype,sources=new WeakMap(),programs=new WeakMap();
 window.__shaderPrograms=[];window.__shaderProgramId=program=>programs.get(program)?.id;
 const wrap=(name,callback)=>{const original=proto[name];proto[name]=function(...args){return callback.call(this,original,args);};};
 wrap('shaderSource',function(original,args){sources.set(args[0],args[1]);return original.apply(this,args);});
 wrap('createProgram',function(original,args){const program=original.apply(this,args),record={id:window.__shaderPrograms.length,shaders:[],checks:[]};programs.set(program,record);window.__shaderPrograms.push(record);return program;});
 wrap('attachShader',function(original,args){programs.get(args[0])?.shaders.push(sources.get(args[1])||'');return original.apply(this,args);});
 for(const name of ['linkProgram','getProgramInfoLog','getProgramParameter'])wrap(name,function(original,args){const start=performance.now();try{return original.apply(this,args);}finally{programs.get(args[0])?.checks.push({name,startMs:start,durationMs:performance.now()-start});}});
}
