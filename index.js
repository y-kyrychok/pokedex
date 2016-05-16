(() =>
{
    "use strict"

    const $ = selector => document.querySelector(selector)
    const api = "http://pokeapi.co"

    let getNextPokemons = (() =>
    {
        let next = "/api/v1/pokemon?limit=12"

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
        let {innerHTML} = $(`[data-is=${name}]`)

        return data => innerHTML.replace(/\$\{(\w+)\}/g, (_, key) =>
        {
            return data[key]
                || { api }[key]
                || ""
        })
        .replace(/@\{(\w+) as (\w+)\}/, (_, key, name) =>
        {
            return data[key]
                .map(getTemplate(name))
                .join("")
        })
    }

    const pokes = { }

    let appendPokemons = pokemons =>
    {
        for (let pokemon of pokemons)
            pokes[pokemon.pkdx_id] = pokemon

        let template = getTemplate("preview")
        let html = pokemons.map(template).join("")

        $("main").insertAdjacentHTML("beforeend", html)
    }

    let loader = (() =>
    {
        let $progress = $(".is-loading")
          , hide = () => $progress.hidden = true
          , show = () => $progress.hidden = false

        return { hide, show }
    })()

    let loadMore = () => getNextPokemons
    ({
        wait: loader.show,
        done(pokemons)
        {
            loader.hide()
            appendPokemons(pokemons)
        }
    })

    loadMore()

    $(".load-more").addEventListener("click", loadMore)

    $("body").addEventListener("click", ({target}) =>
    {
        let $card = target.closest(".pokemon-card")
        if (!$card) return

        let {id} = $card.dataset
        let template = getTemplate("details")

        let $dialog = $(".pokemon-details")
            $dialog.innerHTML = template(pokes[id])
            $dialog.show()
    })
})()