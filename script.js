const editor = ace.edit('editor');
editor.setTheme('ace/theme/monokai');
editor.getSession().setMode('ace/mode/javascript');
editor.$blockScrolling = Infinity;
const evalEditor = ace.edit('evalEditor');
evalEditor.setTheme('ace/theme/monokai');
evalEditor.getSession().setMode('ace/mode/javascript');
evalEditor.$blockScrolling = Infinity;
evalEditor.setValue('// Code written here will be evaluated on the page');
const versionSelect = document.getElementsByTagName('select')[0];
class Container {
  constructor() {
    this.iframe = document.createElement('iframe');
    document.head.appendChild(this.iframe);
  }
  setDiscordJS(version) {
    this.version = version;
    return new Promise((resolve, reject) => {
      if(this.script) {
        this.script.remove();
        delete window.Discord;
      }
      this.script = document.createElement('script');
      this.script.src = 'discord.' + version + '.min.js';
      this.script.onload = resolve;
      this.script.onerror = reject;
      this.iframe.contentDocument.head.appendChild(this.script);
    });
  }
  run(code) {
    this.iframe.contentWindow.eval(code);
  }
  reload() {
    return new Promise((resolve, reject) => {
      this.iframe.contentWindow.location.reload();
      this.iframe.onload = () => {
        this.setDiscordJS(this.version).then(resolve).catch(reject);
      };
    });
  }
};
const container = new Container();
if(localStorage.version) versionSelect.value = localStorage.version;
versionSelect.onchange = () => {
  versionSelect.disabled = true;
  container.setDiscordJS(versionSelect.value)
    .then(() => versionSelect.disabled = false)
    .catch(e => 'Failed to load Discord.js: ' + e);
};
versionSelect.onchange();
const storage = {
  save() {
    localStorage.code = editor.getValue();
  },
  load() {
    editor.setValue(localStorage.code || '');
  }
}
storage.load();
editor.commands.addCommand({
  name: 'save',
  bindKey: {
      win: 'Ctrl-s',
      mac: 'Command-s'
  },
  exec() { 
    storage.save();
  }
});
const Engine = {
  started: false,
  start() {
    if(Engine.started) container.reload().then(Engine.actuallyStart);
    else Engine.actuallyStart();
  },
  actuallyStart() {
    try {
      container.run(editor.getValue());
      Engine.started = true;
    } catch(e) {
      console.error(e);
      Engine.started = false;
    }
  },
  stop() {
    container.reload();
  }
};
document.getElementById('save').onclick = storage.save;
document.getElementById('load').onclick = storage.load;
document.getElementById('reset').onclick = () => {
  if(confirm('Are you sure?')) {
    editor.setValue('');
    delete localStorage.code;
    Engine.stop();
  }
};
document.getElementById('start').onclick = () => {
  Engine.start();
  if(Engine.started) document.getElementById('start').innerText = 'Restart';
}
document.getElementById('stop').onclick = Engine.stop;
document.getElementById('eval').onclick = () => container.run(evalEditor.getValue());
document.getElementById('clear').onclick = () => evalEditor.setValue('');
