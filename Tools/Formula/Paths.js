
import { fromFileUrl , dirname , join } from 'Path'

const 
    self = dirname(fromFileUrl(import.meta.url)) ,
    root = join(self,'..','..') ;


export const areas = 
    join(root,'Areas');
    
export const formulas =
    join(root,'Resources/Formulas.yaml');
