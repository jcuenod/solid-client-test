import {createState, Component} from "solid-js";
import {ChevronLeft, ChevronRight, Book} from "solid-feather-icons"

interface HeaderButtonProps {
    class?: string;
    onClick: Function;
    disabled: boolean;
}
const HeaderButton: Component<HeaderButtonProps> = props => (
    <button
        class={props.class || `
            p-2
            hover:bg-gray-200
            font-bold
            text-gray-900
            flex
            flex-row
            items-center
        `}
        onClick={props.onClick}
        disabled={props.disabled}
    >
        {props.children}
    </button>
)

interface Reference {
    book: string;
    chapter: number;
}
interface HeaderProps {
    prevHandler: Function;
    disablePrevButton: boolean;
    navigateHandler: Function;
    nextHandler: Function;
    disableNextButton: boolean;
    reference: Reference;
}

const enabledChapterButtonClasses = `
p-3
hover:bg-gray-200
hover:text-blue-600
flex
justify-center
items-center
`
const disabledChapterButtonClasses = `
p-3
flex
justify-center
items-center
text-gray-300
`
const Header: Component<HeaderProps> = props => {
    return (
        <header class="flex items-center bg-gray-100 shadow-sm sticky top-0 z-20 ltr text-lg">
            <div class="flex-1 flex items-start items-stretch flex-row">
            </div>
            <div class="flex-1 flex justify-center items-stretch flex-row">

                <HeaderButton
                    class={props.disablePrevButton ? disabledChapterButtonClasses : enabledChapterButtonClasses}
                    onClick={props.prevHandler}
                    disabled={props.disablePrevButton}
                >
                    <ChevronLeft />
                </HeaderButton>
                <HeaderButton onClick={props.navigateHandler}>
                    <Book size="1rem" /><span style="padding: 2px" />{props.reference.book + " " + props.reference.chapter}
                </HeaderButton>
                <HeaderButton
                    onClick={props.nextHandler}
                    class={props.disableNextButton ? disabledChapterButtonClasses : enabledChapterButtonClasses}
                    disabled={props.disableNextButton}>
                    <ChevronRight />
                </HeaderButton>
            </div>
            <div class="flex-1"></div>
        </header>
    )
}
export default Header
