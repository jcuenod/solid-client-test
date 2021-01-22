import { createState, Component } from "solid-js";
import bookDetails from "../data/bookDetails.json"

type Position = "previous" | "current" | "next"
interface CardProps {
    position: Position;
    gridClasses?: string;
}
const Card: Component<CardProps> = props => {
    return <div class={"card w-full " + (props.position !== "current" ? props.position : "")}>
        <div class={"grid m-2 md:mx-auto md:my-10 " + props.gridClasses}
            style="width: 960px; max-width: calc(100vw - 1rem);">
            {props.children}
        </div>
    </div>
}

const BookSelector = props =>
    <Card gridClasses="grid-cols-4 md:grid-cols-7 gap-2" position={props.position}>
        {bookDetails.map(b =>
            <button
                class="text-xl pt-4 pb-3 text-center rounded cursor-pointer bg-gray-200 hover:text-gray-50 hover:bg-blue-300 border-b-4 hover:border-blue-400"
                onClick={e => {
                    e.stopPropagation()
                    props.onClick(b)
                }}
            >
                {b.abbreviation}
            </button>
        )}
    </Card >
const ChapterSelector = props =>
    <Card gridClasses="grid-cols-5 md:grid-cols-10 gap-2" position={props.position}>
        {Array.from(new Array(props.chapters)).map((_, i) =>
            <div
                class="text-xl pt-4 pb-3 text-center rounded cursor-pointer bg-gray-200 hover:text-gray-50 hover:bg-blue-300 border-b-4 hover:border-blue-400"
                onClick={e => {
                    e.stopPropagation()
                    props.onClick(i + 1)
                }}
            >
                {i + 1}
            </div>
        )}
    </Card>


interface HeaderProps {
    visible: boolean;
    onNavigate: Function;
    onHide: Function;
}
const positions = {
    book: 0,
    chapter: 1
}
const chapterNavigationCardStyles = `
.chapter_navigation {
    pointer-events: none;
	-webkit-transition: -webkit-transform 0.1s ease-out, opacity 0.1s ease-out;
	transition: transform 0.1s ease-out, opacity 0.1s ease-out;
    transform: translateY(15%);
    opacity: 0;
    perspective: 400px;
}
.chapter_navigation.show {
	pointer-events: auto;
	-webkit-transform: translateY(0%) scale(1);
    transform: translateY(0%);
    opacity: 1;
}
.chapter_navigation > .card {
    position: absolute;
    transition: transform 0.3s ease-out;
    transform-style: preserve-3d;
    transform: translateX(0) rotateY(0deg) scale(1);
}
.chapter_navigation > .card.previous {
    transform: translateX(-200%) rotateY(-45deg) scale(0.01);
}
.chapter_navigation > .card.next {
    transform: translateX(200%) rotateY(45deg) scale(0.01);
}`
const ChapterNavigation: Component<HeaderProps> = props => {
    const [state, setState] = createState({
        currentCard: positions.book,
        bookChapters: 50,
        selectedBook: {}
    })

    const hideHelper = () => {
        setState({ currentCard: positions.book })
        props.onHide()
    }
    return (
        <div
            class={"fixed left-0 top-0 w-full h-full z-30 overflow-y-scroll overflow-x-hidden py-10 chapter_navigation" + (props.visible ? " show" : "")}
            style="background: rgba(255,255,255,0.6)"
            onClick={hideHelper}
        >
            <style>{chapterNavigationCardStyles}</style>
            <BookSelector
                position={state.currentCard === positions.book ? "current" : "previous"}
                onClick={(newBook) => setState({
                    currentCard: positions.chapter,
                    bookChapters: newBook.chapters,
                    selectedBook: newBook
                })} />
            <ChapterSelector
                position={state.currentCard === positions.chapter ? "current" : "next"}
                chapters={state.bookChapters}
                onClick={newChapter => {
                    props.onNavigate({ book: state.selectedBook.name, chapter: newChapter })
                    hideHelper()
                }}
            />
        </div>
    )
}
export default ChapterNavigation