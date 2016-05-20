"use strict"

document.registerElement("pokedex-filter", class extends HTMLInputElement
{
    static get extends()
    {
        return "input"
    }

    get kind()
    {
        return this.getAttribute("kind")
    }

    createdCallback()
    {
        let {kind} = this

        this.addEventListener("change", () =>
        {
            let {checked} = this
            let event = new CustomEvent("pokedex-show",
            {
                bubbles: true,
                cancelable: true,
                detail: { kind, checked }
            })

            this.dispatchEvent(event)
        })

        document.addEventListener("pokedex-show", ({detail}) =>
        {
            if (kind == detail.kind)
                this.checked = detail.checked
        })
    }
})