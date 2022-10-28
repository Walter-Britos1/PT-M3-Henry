const dflt = (cmd) => {
    process.stdout.write(`El cmd "${cmd}" es inexistente, por favor ingrese uno valido`);
    process.stdout.write('\nprompt > ');
}

module.exports = dflt;