"use strict"

document.registerElement("pokedex-load", class extends HTMLElement
{
    static get extends()
    {
        return "button"
    }

    createdCallback()
    {
        let progress = document.createElement("progress")
        let done = () => progress.hidden = true
            done()

        this.append(progress)
        this.addEventListener("click", () =>
        {
            progress.hidden = false

            let event = new CustomEvent("pokedex-next",
            {
                bubbles: true,
                cancelable: true,
                detail: { done }
            })

            this.dispatchEvent(event)
        })

        if (this.hasAttribute("clicked"))
        {
            this.click()
            this.removeAttribute("clicked")
        }
    }
})