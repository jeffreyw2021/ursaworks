import React from 'react';

// Long body copy is authored in content.json as an array of paragraphs; short
// copy stays a plain string. Both render through here, so a field can gain or
// lose paragraph breaks without touching the component that displays it.
// Where the breaks fall is an editorial call, so it lives in the content file
// rather than being inferred from punctuation at render time.
export default function Paragraphs({ text, className }) {
    const paragraphs = Array.isArray(text) ? text : [text];

    // Keyed by position: the list is static content-file copy that never
    // reorders, and two paragraphs in one field could repeat the same text.
    return paragraphs.map((paragraph, index) => (
        <p className={className} key={index}>{paragraph}</p>
    ));
}
