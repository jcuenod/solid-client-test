import { onMount, createState, createEffect } from "solid-js"

const MARGIN = 1
const Highlighter = props => {
    return <div class="absolute bg-blue-200 z-0 inline-block pointer-events-none" style={{
        display: props.activeWordIndex > -1 ? "block" : "none",
        top: props.top,
        left: props.left,
        width: props.width,
        height: props.height,
        // transform: `rotate(${3 * (1 - 2 * (props.activeWordIndex % 2))}deg)`
    }} />
}

// const words_by_rid = {}
// const calculatePositions = () => {
//     const range = document.createRange()
//     window["poscalc"] = []
//     Object.keys(words_by_rid).forEach(rid => {
//         words_by_rid[rid].map(accent_unit => {
//             let running_total = 0
//             accent_unit.forEach(wbit => {
//                 const { wid, word, trailer } = wbit
//                 const $rid = document.querySelector(`.v${rid}`)
//                 if ($rid) {
//                     range.setStart($rid, running_total)
//                     range.setEnd($rid, running_total + word.length)
//                     const box = range.getClientRects()
//                     window["poscalc"].push({ rid, box, word })
//                 }
//                 else {
//                     console.error("couldn't find verse node to calculate", rid)
//                 }
//             })
//         })
//     })
// }
// if (!window["HebrewPosCalculationsEventFlag"]) {
//     window["HebrewPosCalculationsEventFlag"] = true
//     // window.addEventListener("click", e => {
//     //     if (e.target?.classList.contains("wbit")) {
//     //         document.querySelector(".active")?.classList.remove("active")
//     //         e.target?.classList.add("active")
//     //         console.log(e.target?.classList)
//     //     }
//     // })
//     window["poscalc"] = []
//     window.addEventListener("mousemove", e => {
//         if (e.target?.classList.contains("verse-text")) {
//             if (!window["poscalc"].length) {
//                 calculatePositions()
//             }
//         }
//     })
// }

const flattenWords = wlc => {
    const words: any = []
    wlc.forEach(verse => {
        verse.wlc.forEach(word => {
            word.forEach(bit => {
                words.push(bit)
            })
        })
    })
    return words
}

let $APP_ELEMENT
const positions: any = []
const calculatePositions = ($parentNode, words) => {
    $APP_ELEMENT = document.querySelector(".App")
    const offsetY = $APP_ELEMENT?.scrollTop || 0
    const r = document.createRange()
    let offsetTally = 0
    // The first child of the actual parent is a verse span which contains a verse_number span followed by a text node with the verse text
    let $currentTextNode = $parentNode.firstChild.lastChild
    const getNextTextNode = $current => $current.parentNode.nextSibling.lastChild
    words.forEach((w, i) => {
        if (offsetTally === $currentTextNode.length) {
            $currentTextNode = getNextTextNode($currentTextNode)
            offsetTally = 0
        }
        r.setStart($currentTextNode, offsetTally)
        r.setEnd($currentTextNode, offsetTally + w.word.length)
        positions[i] = r.getBoundingClientRect()
        positions[i].y = positions[i].y + offsetY
        offsetTally += w.word.length + w.trailer.length
    })
}

const wbit = ({ word, trailer }) => word + trailer || ""
const word = bits => bits.map(wbit).join("")

const verse = ({ rid, wlc }) => {
    // words_by_rid[rid] = wlc
    return (
        <span class={`v${rid} verse-text text-gray-700 hover:text-blue-800 cursor-pointer`}>
            <span class="text-red-800 text-xs relative whitespace-nowrap -inset-y-3">
                {rid % 1000 + " "}
            </span>
            {wlc.map(word).join("")}
        </span>
    )
}
const chapter = (verse_array) => {
    const flatWords = flattenWords(verse_array)
    let $chapterNode
    onMount(() => {
        calculatePositions($chapterNode, flatWords)
    })
    const [highlightPosition, setHighlightPosition] = createState({ activeWordIndex: -1, top: "0", left: "0", width: "0", height: "0" })

    return (
        <>
            <Highlighter
                activeWordIndex={highlightPosition.activeWordIndex}
                top={highlightPosition.top}
                left={highlightPosition.left}
                width={highlightPosition.width}
                height={highlightPosition.height} />
            <div ref={$chapterNode}
                class="z-10 relative px-2"
                onMouseMove={e => {
                    const x = e.x
                    const y = e.y + $APP_ELEMENT?.scrollTop || 0
                    const w = positions.findIndex(p =>
                        y > p.y &&
                        y < p.y + p.height &&
                        x > p.x &&
                        x < p.x + p.width
                    )
                    if (w > -1 && highlightPosition.activeWordIndex !== w) {
                        const pos = positions[w]
                        setHighlightPosition({
                            activeWordIndex: w,
                            top: (pos.y - MARGIN) + "px",
                            left: (pos.x - MARGIN) - 3 + "px",
                            width: (pos.width + MARGIN * 2) + 6 + "px",
                            height: (pos.height + MARGIN * 2) + "px",
                        })
                        document.title = flatWords[w].word
                    }
                    else if (w === -1) {
                        setHighlightPosition({
                            activeWordIndex: -1,
                            top: "0",
                            left: "0",
                            width: "0",
                            height: "0"
                        })
                    }
                    // registerActiveWord(w)
                    // else
                    //     deRegisterActiveWord()
                }}>
                {verse_array.map(verse)}
            </div>
        </>
    )
}

export default chapter
