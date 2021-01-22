const words_by_rid = {}
const calculatePositions = () => {
    const range = document.createRange()
    window["poscalc"] = []
    Object.keys(words_by_rid).forEach(rid => {
        words_by_rid[rid].map(accent_unit => {
            let running_total = 0
            accent_unit.forEach(wbit => {
                const { wid, word, trailer } = wbit
                const $rid = document.querySelector(`.v${rid}`)
                if ($rid) {
                    range.setStart($rid, running_total)
                    range.setEnd($rid, running_total + word.length)
                    const box = range.getClientRects()
                    window["poscalc"].push({ rid, box, word })
                }
                else {
                    console.error("couldn't find verse node to calculate", rid)
                }
            })
        })
    })
}
if (!window["HebrewPosCalculationsEventFlag"]) {
    window["HebrewPosCalculationsEventFlag"] = true
    // window.addEventListener("click", e => {
    //     if (e.target?.classList.contains("wbit")) {
    //         document.querySelector(".active")?.classList.remove("active")
    //         e.target?.classList.add("active")
    //         console.log(e.target?.classList)
    //     }
    // })
    window["poscalc"] = []
    window.addEventListener("mousemove", e => {
        if (e.target?.classList.contains("verse-text")) {
            if (!window["poscalc"].length) {
                calculatePositions()
            }
        }
    })
}

const wbit = ({ wid, word, trailer }) => `${word}${trailer || ""}`
const word = verse_number => (bits, index) =>
    (index === 0 ?
        `<span class="text-red-800 text-xs relative whitespace-nowrap -inset-y-3">${verse_number + " "}</span>` :
        "") +
    bits.map(wbit).join("")

const verse = ({ rid, wlc }) => {
    words_by_rid[rid] = wlc
        `<span class="v${rid} verse-text hover:bg-yellow-100">
  ${wlc.map(word(rid % 1000)).join("")}
</span>`
}
const chapter = verse_array =>
    verse_array.map(verse).join("")

export default chapter
