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