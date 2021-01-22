import bookDetails from "../data/bookDetails.json"

const adjacentChapter = (book: string, chapter: number, forward: boolean) => {
    const currentBook = bookDetails.findIndex(b => b.name === book)
    if (currentBook < 0) {
        return {
            book,
            chapter,
            error: true,
            message: "Could not find book in bookDetails. Therefore, could not find adjacent chapter"
        }
    }
    const next_chapter = chapter + (forward ? 1 : -1)
    if (next_chapter <= 0) {
        if (currentBook <= 0) {
            return {
                book,
                chapter,
                error: true,
                message: "Earliest known chapter. Cannot navigate to previous chapter!"
            }
        }
        else {
            return {
                book: bookDetails[currentBook - 1].name,
                chapter: bookDetails[currentBook - 1].chapters,
                error: false,
                message: ""
            }
        }
    }
    if (next_chapter > bookDetails[currentBook].chapters) {
        if (currentBook >= bookDetails.length) {
            return {
                book: book,
                chapter: chapter,
                error: true,
                message: "Last known chapter. Cannot navigate to next chapter"
            }
        }
        else {
            return {
                book: bookDetails[currentBook + 1].name,
                chapter: 1,
                error: false,
                message: ""
            }
        }
    }
    return {
        book: book,
        chapter: next_chapter,
        error: false,
        message: ""
    }
}
export default adjacentChapter