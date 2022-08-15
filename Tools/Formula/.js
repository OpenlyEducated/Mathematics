
import * as Paths from 'Paths'
import { parse } from 'YAML';
import { walk } from 'FileSystem'


const { readTextFile } = Deno;
const { log } = console;

const formulas = {};

Object.entries(parse(await readTextFile(Paths.formulas)))
    .map(([name,string]) => [name,string.trim()])
    .map(([name,string]) => {
        
        const parts = string
            .split(' ')
            .map((part) => {
                
                if(part.includes('_')){
                    
                    let [ identifier , value ] = part.split('_');

                    if(value.startsWith('{'))
                        value = value.slice(1,-1);
                        
                    value = value.trim();
                    
                    return `${ identifier }_{ ${ value }}`;
                }
                
                return part;
            });
        
        const inner = parts.join(' ');
        
        formulas[name] = `$${ inner }$`
    });

log(formulas);




const discoverOptions = {
    includeFiles : true ,
    includeDirs : false ,
    followSymlinks : false ,
    exts : [ 'md' ]
}


for await (const entry of walk(Paths.areas,discoverOptions)){

    const text = await readTextFile(entry.path);
    
    const lines = [];
    
    let open = false;
    let formula;
    
    for(const line of text.split('\n')){
        
        if(open){
            
            if(/^\s*<!--/.test(line)){
                open = false;
            } else
            
            if(/^\s*\$/.test(line)){
                open = false;
                continue;
            } else {
                lines.push(line);
                continue;
            }
            
            
        }
        
        if(/^\s*<!--  F : /.test(line)){
            open = true;
        
            formula = line.match(/^\s*<!--  F : ([\S ]+)  -->\s*$/)[1].trim();
            lines.push(line);
            lines.push(formulas[formula]);
            continue;
        }

        lines.push(line);
    }

    const inserted = lines.join('\n');
    
    // log(inserted);
    
    Deno.writeTextFile(entry.path,inserted);
}
