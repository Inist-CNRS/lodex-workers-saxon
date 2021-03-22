


const ezs = require('@ezs/core');
const statements = require('../lib');

ezs.addPath(__dirname);

ezs.use(statements);
const input = '<root>toto</root>';
const output = [];
const script = `

            [xslt]
            stylesheet = style.xsl

        `;
const stream = ezs.createStream(ezs.bytesMode());
stream
    .pipe(ezs('delegate', { script }))
    .pipe(ezs.catch())
    .on('error', console.error)
    .on('data', (chunk) => {
        output.push(chunk.toString());
    })
    .on('end', () => {
        console.log({output})
    });
stream.write(input);
stream.end();

