const echo = (res) => {
    const newSTR = res.join(' ');
    process.stdout.write(`Soy un echo: "${newSTR}!"`);
    process.stdout.write('\nprompt > ');
};

module.exports = echo;