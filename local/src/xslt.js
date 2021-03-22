import { spawn } from 'child_process';

export default function xslt(data, feed) {
    const { ezs } = this;
    const stylesheet = []
        .concat(this.getParam('stylesheet'))
        .filter(Boolean)
        .shift();

    const params = []
        .concat(this.getParam('param'))
        .filter(Boolean)
        .join(' ');

    const args = [
        '-s:-',
        `-xsl:${stylesheet}`,
    ];

    if (!this.input) {
        const child = spawn(
            'xslt',
            args.concat(params),
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
