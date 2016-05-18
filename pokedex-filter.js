"use strict"

document.registerElement("pokedex-filter", class extends HTMLElement
{
    get type()
    {
        return this.getAttribute("type")
    }

    createdCallback()
    {
        let {type} = this

        this.innerHTML = `<label>${type}<input type=checkbox></label>`

        let $input = this.querySelector("input")

        $input.addEventListener("change", ({target}) =>
        {
            let {checked} = target
            let event = new CustomEvent("pokedex-filter",
            {
                bubbles: true,
                cancelable: true,
                detail: { type, checked }
            })

            this.dispatchEvent(event)
        })

        document.addEventListener("pokedex-filter", ({detail}) =>
        {
            if (type == detail.type)
                $input.checked = detail.checked
        })
    }
})