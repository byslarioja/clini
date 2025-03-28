export default function Highlightable({ text, toHighlight }: { text: string; toHighlight: string }) {
    const normalizeText = (str: string) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // Removes diacritics

    const normalizedText = normalizeText(text);
    const normalizedToHighlight = normalizeText(toHighlight);

    if (!normalizedText.toLowerCase().includes(normalizedToHighlight.toLowerCase())) {
        return text;
    }

    const parts = text.split(new RegExp(`(${normalizedToHighlight})`, 'gi'));

    return (
        <>
            {parts.map((part, index) =>
                normalizeText(part).toLowerCase() === normalizedToHighlight.toLowerCase() ? <mark key={index}>{part}</mark> : part,
            )}
        </>
    );
}
