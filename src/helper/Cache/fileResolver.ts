import path from 'path'
import { ensureCachedir } from './pathResolver.js'

export function getCacheFilePath(key:string){
    const dir = ensureCachedir();
    return path.join(dir,`${key}.json`)
}