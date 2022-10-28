const fs = require('fs');

const head = (rest) => {
    if (err) throw err
    const line = data.split("\n");
    process.stdout.write(lines.slice(0, (rest[1] ? parseInt(rest[1]) : 10)).join("\n"));
    process.stdout.write('\nprompt > ');
};

module.exports = head;