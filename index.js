const path = require('path');
const fs = require('fs');
const exec = require('child_process').exec;

const detectCharacterEncoding = require('detect-character-encoding');

function is_dir(path) {
    try {
        var stat = fs.lstatSync(path);        
        return stat.isDirectory();
    } catch (e) {        
        return false;
    }
}

 function check(){

    let result = [];

    let locate = path.resolve( __dirname, '..' );

    let cmd = `find ${locate}/project_files/ -type f -name "*.php" -o -name "*.js" > ${locate}/node-exec-comand-encoding/search.txt`;

     exec(cmd, function() {    
      
        let dir_file = `${locate}/node-exec-comand-encoding/search.txt`;

        fs.readFile(dir_file, 'utf8', function (err, content) {
            
            let texto = content.split('\n');
    
            texto.forEach( function(line){
    
                let isDir = is_dir(line);   
                
                if(!isDir) {
                                        
                    try {
                        
                        let fileBuffer =  fs.readFileSync(line);                    
                        let charsetMatch =  detectCharacterEncoding(fileBuffer);
                                            
                        result.push( 'FILE:' + line + ' ECODING: ' + charsetMatch.encoding )                        
                        
                    } catch (error) {                        
                        result.push( 'ERRO FILE:' + line )                        
                    }
                    
                } 
    
            })
    
            let resultFile = fs.createWriteStream('result.txt');
            resultFile.on('error', function(err) { /* error handling */ });
            result.forEach(function(value) {
                resultFile.write(value + '\n');
            });
            resultFile.end();
    
        }); 
        
    })
    
  }

  check()


