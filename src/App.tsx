import { createState } from "solid-js"
import './App.css';
import chapter_data from './chapter-text.json'
import "tailwindcss/tailwind.css"
import Header from "./components/Header";
import chapter from "./components/Hebrew";
import ChapterNavigation from "./components/ChapterNavigation"
import adjacentChapter from "./util/adjacentChapter"

// const r = () => Math.round(Math.random() * 673)
// const getHotWordsCss = () => {
//   const w = Array.from(Array(200))
//   const cssSelector = w.map(_ => `span[data-wid='${r()}']`).join(",\n")
//   return `${cssSelector} {
//    color: #F59E0B; 
//   }`
// }


function App() {
  const [state, setState] = createState({
    currentBook: "Genesis",
    currentChapter: 1,
    chapterData: chapter_data,
    showNavigate: false
  })

  const goToChapter = ({ book, chapter }) => {
    fetch("https://parabible.com/api/chapter-text", {
      method: "POST",
      headers: { "content-type": "application/json; charset=utf-8" },
      mode: "cors",
      body: JSON.stringify({ "reference": { book, chapter }, "texts": ["wlc"] })
    }).then(r => r.json()).then(data => {
      console.timeLog()
      setState({
        currentBook: book,
        currentChapter: chapter,
        chapterData: data
      })
      console.timeEnd()
    }).catch(e => {
      console.log("oh no/..")
      console.error(e)
    })
  }
  const goToAdjacentChapter = ({ forward }) => () => {
    const adjacent = adjacentChapter(state.currentBook, state.currentChapter, forward)
    if (adjacent.error) {
      console.error("Cannot navigate to adjacent chapter:")
      console.error(adjacent.message)
      return
    }
    goToChapter(adjacent)
  }

  // <button onClick={() => setState({ hotwords: getHotWordsCss() })}>Trigger</button>

  return (
    <div class={"App absolute top-0 left-0 w-full h-full " + (state.showNavigate ? "overflow-hidden" : "overflow-y-auto")}>
      <Header
        disablePrevButton={adjacentChapter(state.currentBook, state.currentChapter, false).error}
        prevHandler={goToAdjacentChapter({ forward: false })}
        navigateHandler={() => setState({ showNavigate: !state.showNavigate })}
        disableNextButton={adjacentChapter(state.currentBook, state.currentChapter, true).error}
        nextHandler={goToAdjacentChapter({ forward: true })}
        reference={{ book: state.currentBook, chapter: state.currentChapter }} />
      <ChapterNavigation
        visible={state.showNavigate}
        onHide={() => setState({ showNavigate: false })}
        onNavigate={goToChapter}
      />
      <div class="flex flex-col">
        <div class="flex justify-center">
          <div class="m-8 text-4xl text-right max-w-screen-md text-gray-700"
            style={`
              direction: rtl;
              font-family: "SBL Hebrew";
              line-height: 150% !important;
            `}
            onClick={e => {
              console.log(e.target.dataset.wid)
              console.log(e)
            }}
          // innerHTML={chapter(state.chapter.text)}
          >
            {chapter(state.chapterData.text)}
          </div>
        </div>
      </div>
    </div >
  );
}

export default App;
