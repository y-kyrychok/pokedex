"use strict"

document.registerElement("pokedex-card", class extends HTMLElement
{
    get number()
    {
        return this.getAttribute("number")
    }

    hasType(type)
    {
        return !!this.querySelector(`pokedex-filter[type=${type}]`)
    }
})