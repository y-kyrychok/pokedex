(() =>
{
    "use strict"

    const $ = selector => document.querySelector(selector)
    const api = "http://pokeapi.co"
    const pokes = { }

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

            $("main").insertAdjacentHTML("beforeend", html)
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
        let $button = event.target.closest("[is=pokedex-type]")
        if (!$button) return

        let type = $button.getAttribute("kind")
        let $pokemons = document.querySelectorAll("[is=pokedex-card]")

        for (let $pokemon of $pokemons)
        {
            $pokemon.hidden = !$pokemon
                .querySelector(`[kind=${type}]`)
        }

        event.stopImmediatePropagation()
    })

    $("body").addEventListener("click", ({target}) =>
    {
        let $card = target.closest("[is=pokedex-card]")
        if (!$card) return

        let id = $card.getAttribute("number")
        let template = getTemplate("details")

        let $dialog = $(".pokedex-details")
            $dialog.innerHTML = template(pokes[id])
            $dialog.show()
    })
})()