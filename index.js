(() =>
{
    "use strict"

    const $ = selector => document.querySelector(selector)
    const api = "http://pokeapi.co"

    let getNextPokemons = (() =>
    {
        let next = "/api/v1/pokemon/?limit=12"

        return state =>
        {
            state.wait()

            let request = new XMLHttpRequest
                request.responseType = "json"
                request.open("GET", api + next)
                request.send()

            request.onload = () =>
            {
                let {meta, objects} = request.response
                state.done(objects)

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

    const pokes = { }

    let loadMore = (() =>
    {
        let appendPokemons = pokemons =>
        {
            for (let pokemon of pokemons)
                pokes[pokemon.pkdx_id] = pokemon

            let template = getTemplate("preview")
            let html = pokemons.map(template).join("")

            $("main").insertAdjacentHTML("beforeend", html)
        }

        let getAndAppend = () => getNextPokemons
        ({
            wait()
            {
                $progress.hidden = false
            },
            done(pokemons)
            {
                $progress.hidden = true
                appendPokemons(pokemons)
            }
        })

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

        let {type} = $button.dataset
        let $pokemons = document.querySelectorAll("[is=pokemon-card]")

        for (let $pokemon of $pokemons)
        {
            $pokemon.hidden = !$pokemon
                .querySelector(`[data-type=${type}]`)
        }

        event.stopImmediatePropagation()
    })

    $("body").addEventListener("click", ({target}) =>
    {
        let $card = target.closest("[is=pokedex-card]")
        if (!$card) return

        let {id} = $card.dataset
        let template = getTemplate("details")

        let $dialog = $(".pokedex-details")
            $dialog.innerHTML = template(pokes[id])
            $dialog.show()
    })
})()