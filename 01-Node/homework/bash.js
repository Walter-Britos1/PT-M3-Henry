const commands = require('./commands');

process.stdout.write('prompt > ');
process.stdin.on('data', (data) =>{
    var [cdm, ...rest] = data.toString().trim().split(' ');
    console.log(cdm);
    console.log(rest);
    commands.hasOwnProperty(cdm) ? commands[cdm](rest) : commands.dflt(cdm);
});