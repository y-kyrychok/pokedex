(() =>
{
    "use strict"

    const compose = (...fns) => (...args) =>
    {
        for (let fn of fns) fn(...args)
    }

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
                request.open("GET", `${api}${next}`)
                request.send()

            request.onload = () =>
            {
                let {meta, objects} = request.response

                ;( {next} = meta )

                state.done(objects)
            }
        }
    })()

    let getTemplate = name =>
    {
        let {innerHTML} = document.querySelector(`[data-is=${name}]`)

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

    let appendPokemons = pokemons =>
    {
        let template = getTemplate("preview")
        let html = pokemons.map(template).join("")

        $("main").insertAdjacentHTML("beforeend", html)
    }

    let loader = (() =>
    {
        let $progress = $(".is-loading")

        let hide = () => $progress.hidden = true
        let show = () => $progress.hidden = false

        return { hide, show }
    })()

    let loadMore = () => getNextPokemons
    ({
        wait: loader.show,
        done: compose(loader.hide, appendPokemons)
    })

    loadMore()

    $(".load-more").addEventListener("click", loadMore)
})()