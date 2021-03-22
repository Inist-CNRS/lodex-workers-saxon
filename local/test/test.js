import ezs from '@ezs/core';
import statements from '../src';

ezs.addPath(__dirname);

describe('saxon', () => {
    test('xslt', (done) => {
        ezs.use(statements);
        const input = '<root>toto</root>';
        const output = [];
        const script = `

            [xslt]
            stylesheet = test/style.xsl

        `;
        const stream = ezs.createStream(ezs.bytesMode());
        stream
            .pipe(ezs('delegate', { script }))
            .pipe(ezs.catch())
            .on('error', done)
            .on('data', (chunk) => {
                output.push(chunk);
            })
            .on('end', () => {
                expect(output.join('')).toEqual('<?xml version=\"1.0\" encoding=\"UTF-8\"?><root>~toto</root>');
                done();
            });
        stream.write(input);
        stream.end();
    });
    test('xslt without param', (done) => {
        ezs.use(statements);
        const input = '<root>toto</root>';
        const output = [];
        const script = `

            [xslt]
            stylesheet = test/style.xsl
            param = prefix=X

        `;
        const stream = ezs.createStream(ezs.bytesMode());
        stream
            .pipe(ezs('delegate', { script }))
            .pipe(ezs.catch())
            .on('error', done)
            .on('data', (chunk) => {
                output.push(chunk);
            })
            .on('end', () => {
                expect(output.join('')).toEqual('<?xml version=\"1.0\" encoding=\"UTF-8\"?><root>Xtoto</root>');
                done();
            });
        stream.write(input);
        stream.end();
    });
});
