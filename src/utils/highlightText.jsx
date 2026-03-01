import React from "react";

function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Returns an array of React nodes with <mark> around matches.
 * - Supports multi-word queries (split by spaces)
 * - Case-insensitive
 * - Safe against regex special chars
 */
export function highlightText(text, query, markClassName) {
    const source = String(text ?? "");
    const q = String(query ?? "").trim();

    if (!q) return source;

    const tokens = q
        .split(/\s+/)
        .map((t) => t.trim())
        .filter(Boolean)
        .map(escapeRegExp);

    if (tokens.length === 0) return source;

    // prefer longer tokens first so "policy" doesn't split "policies" weirdly
    tokens.sort((a, b) => b.length - a.length);

    const regex = new RegExp(`(${tokens.join("|")})`, "gi");

    const parts = source.split(regex);

    return parts.map((part, idx) => {
        // if it matches the regex, wrap it
        if (regex.test(part)) {
            return (
                <mark key={idx} className={markClassName}>
                    {part}
                </mark>
            );
        }
        return <React.Fragment key={idx}>{part}</React.Fragment>;
    });
}