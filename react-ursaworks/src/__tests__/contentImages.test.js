import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import content from '../content.json';

// Parse the extension list out of the real glob so this test cannot drift from
// it. An image whose extension is missing there resolves to null and renders as
// a broken image, with only a console.error to show for it.
const __dirname = dirname(fileURLToPath(import.meta.url));
const loaderSource = fs.readFileSync(
    resolve(__dirname, '../configs/loadImages.js'),
    'utf8'
);
const supported = loaderSource.match(/\*\.\{([^}]+)\}/)[1].split(',');

const referencedImages = [
    content.aboutImage,
    ...content.robots.map((robot) => robot.image),
    ...content.events.map((event) => event.image),
    ...content.team.map((member) => member.image),
];

test.each(referencedImages)('%s has an extension loadImages can resolve', (filename) => {
    expect(supported).toContain(filename.split('.').pop().toLowerCase());
});
