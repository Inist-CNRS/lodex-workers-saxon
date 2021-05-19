import { spawn } from 'child_process';

export default function fop(data, feed) {
    const { ezs } = this;
    const config = []
        .concat(this.getParam('config'))
        .filter(Boolean)
        .shift();

    const args = [
        '-fo -',
        '-pdf -',
        config ? `-c ${config}` : '',
    ];

    if (!this.input) {
        const child = spawn(
            'fop',
            args.filter(Boolean),
            {
                stdio: ['pipe', 'pipe', process.stderr],
                detached: false,
                shell: true,
            },
        );
        child.on('error', (err) => feed.stop(err));
        this.input = ezs.createStream(ezs.bytesMode());
        this.input.pipe(child.stdin);
        this.whenFinish = feed.flow(child.stdout);
    }
    if (this.isLast()) {
        this.whenFinish.finally(() => feed.close());
        return this.input.end();
    }
    return ezs.writeTo(this.input, data, () => feed.end());
}
