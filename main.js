let std = {};
class __File {
    /**@arg {string} file_name */
    constructor(file_name) {
        name = file_name;
    }
    /**@type {string} */
    contents = null;
}
class __Directory {
    /**@arg {string} file @arg {string} contents */
    link_contents(file, contents) {
        let n = new __File(file);
        n.contents = contents;
        x: {
            for (let x, i = 0; i < this.children.length; i++) {
                x = this.children[i];
                if (x.name === file) {
                    this.children[i] = x;
                }
            }
            this.children.push(n);
        }
    }
    get_file(file_name){}
    get_child(dir_name){}
    /**@type {(__Directory|__File)[]} */
    children = []
}
class __Fs {
    mkdir(dir) {
        let m_dir=new __Directory(dir);
        this.dirs.push(m_dir);
        return m_dir;
    }
    cd(dir) {
        x: for (let x of dirs) {
            if (x.dir === dir) {
                this.cwd = x;
                break x;
            }
        }
        throw Error('DirectoryNotFoundError');
    }
    get_file(f_name){
        if(fname[0]!=='/'){
            let path=f_name.split('/');
            let m_dir=this.cwd;
            if(path.length==1){
                return m_dir.get_file(path[0]);
            }else{
                let stop=path.length-1;
                for(let i=0;i<stop;i++){
                    m_dir=m_dir.get_child(path[i]);
                }
                return m_dir.get_file(path[path.length-1]);
            }
        }
    }
    children = [];
    cwd = null;
};
let __fs = new __Fs;
let __fs_root = __fs.mkdir('/');
__fs_root.link_contents('hello.jam', `
def main {

}`);
__fs.cd('/');
std.fs.read_to_string = function (file) {
    console.log('fs-read', file);
    __fs.get_file(file);
}
class Default { };
class Token {
    as_rust =`
    enum Token {
        Word(String),
        LCurly,
        RCurly,
        LParan,
        RParan
    }`
}
class Jam {
    constructor() { }
    new() {
        definitions = [];
    }
    impl_arr = [Default];
    /**@arg {Ast} ast */
    eval(ast) {
        let self = this;
        ast.match([
            ['Ast::Call(def_id)', function (def_id_ref) {
                let definition = self.definitions[def_id_ref.deref()];
                definition.match([
                    ['Definition::Block(block)', function () { }],
                    ['Definition::Internal(internal)', function () { }],
                ])
            }],
            ['']
        ]);
    }
    print(str) {
        console.log(str);
    }
    lex(file_name) {
        std.fs.read_to_string(fname).unwrap();
    }
}
function rust_new(val) {
    if (val.prototype.new) {
        let obj=new val;
        obj.new();
        return obj;
    } else {
        throw Error('Can\'t create new');
    }
}
function run(file_name) {
    let engine = rust_new(Jam);
    let tok = engine.lex(fname);
    if (tok.iserr) return tok;
    let ast = engine.parse(tok);
    if (ast.iserr) return ast;
    eval(ast);
}
class Block {
    body = new Ast(null);
}
class JamError {
    as_rust = `
    enum JamError{
        BadLex,
        BadParse,
    }`
    js_opt = [0, 1]
    js_map_rust = ['BadLex', 'BadParse']
}
class Box {
    constructor(val) {
        this.inner = val;
    }
}
class Ast {
    as_rust = `
    enum Ast{
        Call(DefId),
        Push(Box<Ast>)
    }`
    constructor(v_in) {
        if (v_in === null) {
            this.ast_all = null;
        } else {
            this.ast_all = v_in;
        }
    }
    /**@arg {[string,CallableFunction][]} mat*/
    match(mat) {
        x:for (let i = 0; i < mat.length; i++) {
            let cur = mat[i];
            let mat_def = cur[0];
            let res = this.do_match(mat_def);
            if (res.matches) {
                let fn=cur[1];
                return fn(...res.results);
            }
        }
        throw Error('Match missing');
    }
    do_match(def) {
        console.log(def);
        console.assert(false,'todo!()');
        return { matches: false };
    }
};
run("hello.jam");
/*
 *getEventListeners(document.querySelector(".quick-input-action>.monaco-button.monaco-text-button:not([title])")).click[0].listener({}); 
 {let dbg=DebugAPI.the();dbg.attach(debug, undebug, getEventListeners);key_event_array=[];key_event_array[0]={keyCode:17,ctrlKey:true,shiftKey:false};key_event_array[1]={keyCode:16,ctrlKey:true,shiftKey:true};key_event_array[2]={keyCode:80,ctrlKey:true,shiftKey:true};[getEventListeners(window).keydown[0]].forEach(e=>{for(j of key_event_array)e.listener(j)});[getEventListeners(window).keyup[0]].forEach(e=>{for(j of key_event_array)e.listener(j)});await new Promise(a=>{setTimeout(a)});
dbg.debuggerGetVar(dbg.getEventListeners(document.querySelector(".quick-input-action>.monaco-button.monaco-text-button:not([title])")).click[0].listener,{},[{}],"[this]");
}
function win_to_arr(win){let win_acc=new Proxy({length:win.length},{get(a,b,c){if(b===Symbol.iterator)return a[b];if(b==='length'){return a[b]};return win[b]}});return {...Array.from(win_acc),from:win,length:win_acc.length}}
function get_par_id(win){return Array.from(win_to_arr(win.parent)).indexOf(win)}
[,...Object.keys(Object.getOwnPropertyDescriptors(globalThis)).filter(e=>e.match(/^on/)).map(e=>e.slice(2)),,].join('","').slice(2,-2)
[,Object.keys(Object.getOwnPropertyDescriptors(globalThis)).filter(e=>e.includes("HTML")),,].join(",").replace(/,/g,'","')
{function x(v){return v()};1;try{x({})}catch(e){}}
'"'+[["/mnt/c/Program Files/qemu/qemu-system-i386.exe", "-s", "-m", "1G", "-smp", "2", "-display", "sdl,gl=off", "-device", "VGA,vgamem_mb=64", "-drive", "file=\\\\wsl$\\Ubuntu\\root\\serenity\\Build\\i686\\_disk_image,format=raw,index=0,media=disk", "-device", "virtio-serial,max_ports=2", "-device", "virtconsole,chardev=stdout", "-device", "isa-debugcon,chardev=stdout", "-device", "virtio-rng-pci", "-audiodev", "dsound,id=snd0", "-machine", "pcspk-audiodev=snd0", "-device", "sb16,audiodev=snd0", "-device", "pci-bridge,chassis_nr=1,id=bridge1", "-device", "e1000,bus=bridge1", "-device", "i82801b11-bridge,bus=bridge1,id=bridge2", "-device", "sdhci-pci,bus=bridge2", "-device", "i82801b11-bridge,id=bridge3", "-device", "sdhci-pci,bus=bridge3", "-device", "ich9-ahci,bus=bridge3", "-chardev", "stdio,id=stdout,mux=on", "-cpu", "max,vmx=off,-x2apic", "-d", "guest_errors", "-usb", "-chardev", "qemu-vdagent,clipboard=on,mouse=off,id=vdagent,name=vdagent", "-spice", "port=5930,agent-mouse=off,disable-ticketing=on","-device", "virtserialport,chardev=vdagent,nr=1", "-accel", "whpx,kernel-irqchip=off", "-accel", "tcg", "-netdev", "user,id=breh,hostfwd=tcp:127.0.0.1:8888-10.0.2.15:8888,hostfwd=tcp:127.0.0.1:8823-10.0.2.15:23,hostfwd=tcp:127.0.0.1:8000-10.0.2.15:8000,hostfwd=tcp:127.0.0.1:2222-10.0.2.15:22", "-device", "e1000,netdev=breh", "-kernel", "Kernel/Prekernel/Prekernel", "-initrd", "Kernel/Kernel", "-append", "hello disable_virtio"], ["WSL_DISTRO_NAME=Ubuntu", "WSL_INTEROP=/run/WSL/10401_interop", "PWD=/root/serenity/Build/i686", "SDL_VIDEO_X11_DGAMOUSE=0", "SERENITY_ARCH=i686", "HOSTTYPE=x86_64", "WSLENV="]][0].join('" "').replace(/\\/g,"\\\\")+'"'

 */