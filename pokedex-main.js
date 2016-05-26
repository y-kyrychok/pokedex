"use strict"

const api = "http://pokeapi.co"
const append = ($element, html) =>
    $element.insertAdjacentHTML("beforeend", html)

const getTemplate = name =>
{
    let {innerHTML} = document.querySelector(`[data-for=${name}]`)
      , props = /\{\s*(\w+)\s*\}/g
      , loops = /@\{\s*(\w+)\s+as\s+(\w+)\s*\}/g

    return data => innerHTML.replace(props, (_, key) =>
    {
        return data[key]
            || { api }[key]
            || ""
    })
    .replace(loops, (_, key, name) =>
    {
        return data[key]
            .map(getTemplate(name))
            .join("")
    })
}

document.registerElement("pokedex-main", class extends HTMLElement
{
    get container()
    {
        let tag = this.getAttribute("container")

        return this.querySelector(tag)
    }

    get template()
    {
        let name = this.getAttribute("template")

        return getTemplate(name)
    }

    createdCallback()
    {
        let {container, template} = this

        this._next = "/api/v1/pokemon/?limit=12"
        this._pokemons = {}
        this.addEventListener("pokedex-next", ({detail}) =>
        {
            this.getNextPokemons(pokemons =>
            {
                let html = pokemons.map(template).join("")

                append(container, html)

                detail.done()
            })
        })
    }

    getNextPokemons(callback)
    {
        let request = new XMLHttpRequest
            request.responseType = "json"
            request.open("GET", api + this._next)
            request.send()

        request.onload = () =>
        {
            let {meta, objects} = request.response

            this._next = meta.next

            for (let pokemon of objects)
            {
                this._pokemons[pokemon.pkdx_id] = pokemon
            }

            callback(objects)
        }
    }
})