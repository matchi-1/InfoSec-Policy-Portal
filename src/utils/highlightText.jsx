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
export function highlightText(text, query) {
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

    const highlightStyle = {
        background: "rgba(255, 222, 101, 0.58)",
        color: "inherit",
        borderRadius: "0.2rem",
    };

    return parts.map((part, idx) => {
        // IMPORTANT: regex has /g, so reset lastIndex before testing
        regex.lastIndex = 0;

        if (regex.test(part)) {
            return (
                <mark key={idx} style={highlightStyle}>
                    {part}
                </mark>
            );
        }

        return <React.Fragment key={idx}>{part}</React.Fragment>;
    });
}