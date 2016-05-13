(() =>
{
    "use strict"

    const $ = selector => document.querySelector(selector)
    const api = "http://pokeapi.co"

    let getNextPokemons = (() =>
    {
        let next = "/api/v1/pokemon?limit=12"

        return callback =>
        {
            let request = new XMLHttpRequest
                request.responseType = "json"
                request.open("GET", `${api}${next}`)
                request.send()

            request.onload = () =>
            {
                let {meta, objects} = request.response

                ;( {next} = meta )

                callback(objects)
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

    getNextPokemons(pokemons =>
    {
        let template = getTemplate("preview")
        let html = pokemons.map(template).join("")

        $("main").insertAdjacentHTML("beforeend", html)
    })
})()