(() =>
{
    "use strict"

    const $ = selector => document.querySelector(selector)
    const api = "http://pokeapi.co"
    const pokes = { }

    let append = ($element, html) =>
        $element.insertAdjacentHTML("beforeend", html)

    let getNextPokemons = (() =>
    {
        let next = "/api/v1/pokemon/?limit=12"

        return callback =>
        {
            let request = new XMLHttpRequest
                request.responseType = "json"
                request.open("GET", api + next)
                request.send()

            request.onload = () =>
            {
                let {meta, objects} = request.response

                for (let pokemon of objects)
                    pokes[pokemon.pkdx_id] = pokemon

                callback(objects)

                ;({next} = meta)
            }
        }
    })()

    let getTemplate = name =>
    {
        let {innerHTML} = $(`[data-for=${name}]`)
          , props = /\$\{\s*(\w+)\s*\}/g
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

    let loadMore = (() =>
    {
        let appendPokemons = pokemons =>
        {
            let template = getTemplate("preview")
            let html = pokemons.map(template).join("")

            append($("main"), html)
        }

        let getAndAppend = () =>
        {
            $progress.hidden = false

            getNextPokemons(pokemons =>
            {
                appendPokemons(pokemons)
                $progress.hidden = true
            })
        }

        let $button = $(".pokedex-load")
            $button.addEventListener("click", getAndAppend)

        let $progress = $button.querySelector("progress")

        return getAndAppend
    })()

    loadMore()

    $("body").addEventListener("click", event =>
    {
        let $card = event.target.closest("pokedex-card")
        if (!$card) return

        let {number} = $card
        let template = getTemplate("details")

        append($dialog, template(pokes[number]))
        $dialog.showModal(event)
    })

    let $dialog = $(".pokedex-details")

    let filter = Object.create(null)

    $("body").addEventListener("pokedex-filter", ({detail}) =>
    {
        let {type, checked} = detail

        filter[type] = checked
    
        let $pokemons = document.querySelectorAll("pokedex-card")
        let showOnly = Object.keys(filter).filter(key => filter[key])

        for (let $pokemon of $pokemons)
        {
            $pokemon.hidden = !showOnly
                .some(type => $pokemon.hasType(type))
        }
    })

    $dialog
        .querySelector(".close")
        .addEventListener("click", () => $dialog.close())
})()