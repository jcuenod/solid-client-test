const wbit = ({ wid, word, trailer }) => [
    <span data-wid={wid} class="cursor-pointer hover:text-pb-700">{word}</span>,
    trailer || null
]
const word = verse_number => (bits, index) =>
    index === 0 ?
        [<span class="text-red-800 text-xs relative whitespace-nowrap -inset-y-3">{verse_number + " "}</span>,
        bits.map(wbit)]
        : bits.map(wbit)
const verse = ({ rid, wlc }) =>
    <span class="hover:bg-yellow-100">
        {...wlc.map(word(rid % 1000))}
    </span>
const chapter = verse_array =>
    verse_array.map(verse)

export default chapter