(() =>
{
    "use strict"

    const $ = selector => document.querySelector(selector)
    const api = "http://pokeapi.co"

    let getNextPokemons = (() =>
    {
        let next = "/api/v1/pokemon?limit=12"
        let call = (value, param) => [ ]
            .concat(value)
            .forEach(callback => callback(param))

        return state =>
        {
            call(state.wait)

            let request = new XMLHttpRequest
                request.responseType = "json"
                request.open("GET", `${api}${next}`)
                request.send()

            request.onload = () =>
            {
                let {meta, objects} = request.response

                ;( {next} = meta )

                call(state.done, objects)
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

    getNextPokemons
    ({
        wait: loader.show,
        done: [ loader.hide, appendPokemons ]
    })

    $(".load-more").addEventListener("click", () =>
    {
        getNextPokemons
        ({
            wait: loader.show,
            done: [ loader.hide, appendPokemons ]
        })
    })
})()