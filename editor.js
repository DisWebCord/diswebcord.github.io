var editor = ace.edit("editor");
  editor.setTheme("ace/theme/monokai");
  editor.getSession().setMode("ace/mode/javascript");
  editor.$blockScrolling = Infinity;
  editor.setValue((!localStorage.code ? "" : localStorage.code));
	
  var Storage = {
    save: function(){
      localStorage.code = editor.getValue();
    },
    load: function(){
	    editor.setValue((!localStorage.code ? "" : localStorage.code));
    },
    reset: function(){
      if(confirm('Are you sure you want to reset ALL of your code?')){
        editor.setValue(null);
        localStorage.code = null;
      }
    }
  };
  
  var Engine = {
    started: false,
    start: function(){
      if(Engine.started) if(!confirm('The client has already started, clicking on YES might result in double events')) return;
	    try{
        eval(editor.getValue());
        Engine.started = true;
      }catch(e){
        console.error(e);
        Engine.started = false;
      }
    },
    stop: function(){
      location.reload(); // Unload all code to prevent errors & stop the script
    }
  };
