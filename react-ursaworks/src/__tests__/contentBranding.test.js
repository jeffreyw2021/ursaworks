import content from '../content.json';

// RoboMaster North America rebranded to ARC. The single intentional survivor is
// the historical note in the ARC section; anything else naming the old brand is
// a miss. Historical event names like "RMNA 2025" are correct and unaffected —
// those events really did happen under that name.
const ALLOWED_MENTIONS = ['formerly RoboMaster North America'];

test('content.json carries no leftover RoboMaster branding', () => {
    let text = JSON.stringify(content);
    for (const allowed of ALLOWED_MENTIONS) {
        text = text.split(allowed).join('');
    }
    expect(text).not.toMatch(/robomaster/i);
});

test('robots are ordered Infantry, Sentry, Hero', () => {
    expect(content.robots.map((robot) => robot.name)).toEqual(['Infantry', 'Sentry', 'Hero']);
});

test('competition tags carry no location', () => {
    // Locations belong on event entries, which record where each year was held.
    // On the competition cards they go stale — the championship venue moves.
    for (const competition of content.competitions) {
        expect(competition.tag).not.toMatch(/,/);
    }
});
