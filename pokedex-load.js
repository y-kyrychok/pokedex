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
            progress.hidden = true

        let done = () => progress.hidden = true

        this.append(progress)
        this.addEventListener("click", () =>
        {
            progress.hidden = false

            let event = new CustomEvent("pokedex-load",
            {
                bubbles: true,
                cancelable: true,
                detail: { done }
            })

            this.dispatchEvent(event)
        })
    }
})