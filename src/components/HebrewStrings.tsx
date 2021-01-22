if (!window["hsEvent"]) {
    window["hsEvent"] = true
    window.addEventListener("click", e => {
        if (e.target?.classList.contains("wbit")) {
            document.querySelector(".active")?.classList.remove("active")
            e.target?.classList.add("active")
            console.log(e.target?.classList)
        }
    })
}

const wbit = ({ wid, word, trailer }) =>
    `<span data-wid=${wid} class="cursor-pointer hover:text-blue-500 wbit">${word}</span>${trailer || ""}`
const word = verse_number => (bits, index) =>
    (index === 0 ?
        `<span class="text-red-800 text-xs relative whitespace-nowrap -inset-y-3">${verse_number + " "}</span>` :
        "") +
    bits.map(wbit).join("")
const verse = ({ rid, wlc }) =>
    `<span class="hover:bg-yellow-100">
  ${wlc.map(word(rid % 1000)).join("")}
</span>`
const chapter = verse_array =>
    verse_array.map(verse).join("")

export default chapter
