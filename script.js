const editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.getSession().setMode("ace/mode/javascript");
editor.$blockScrolling = Infinity;
const evalEditor = ace.edit("editor");
evalEditor.setTheme("ace/theme/monokai");
evalEditor.getSession().setMode("ace/mode/javascript");
evalEditor.$blockScrolling = Infinity;
evalEditor.setValue('// Code written here will be evaluated on the page');
const versionSelect = document.getElementsByTagName('select')[0];
const Storage = {
  save() {
    localStorage.code = editor.getValue();
  },
  load() {
    editor.setValue(localStorage.code || '');
  },
  reset() {
    if(confirm('Are you sure?')) {
      editor.setValue(null);
      localStorage.code = null;
    }
  }
};
Storage.load();
const Engine = {
  started: false,
  start() {
    if(Engine.started) if(!confirm('The client has already started, clicking on YES might result in double instances')) return;
    try {
      eval(editor.getValue());
      Engine.started = true;
    } catch(e) {
      console.error(e);
      Engine.started = false;
    }
  },
  stop() {
    location.reload();
  },
  newVersion(version) {
    if(Engine.started) return alert('Client must not be running');
    delete window.Discord;
    versionSelect.disabled = true;
    document.getElementsByTagName('script')[0].remove();
    const script = document.createElement('script');
    script.src = 'discord.' + version + '.min.js';
    script.addEventListener('load', () => {
      versionSelect.disabled = false;
    });
    document.head.appendChild(script);
    localStorage.version = version;
  }
};
if(localStorage.version !== versionSelect.value && localStorage.version !== undefined) {
  Engine.newVersion(versionSelect.value = localStorage.version);
}
