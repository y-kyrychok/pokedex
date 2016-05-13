(() =>
{
    "use strict"

    const api = "http://pokeapi.co"
    const main = document.querySelector("main")

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
                let
                {
                    meta: {next},
                    objects
                }
                = request.response

                callback(objects)
            }
        }
    })()

    let getTemplate = name =>
    {
        let {innerHTML} = document.querySelector(`.${name}`)

        return data => innerHTML
            .replace(/\$\{(\w+)\}/g, (_, key) => data[key] || "")
    }

    getNextPokemons(pokemons =>
    {
        let template = getTemplate("pokemon-preview")
        let html = pokemons.map(template).join("")

        main.insertAdjacentHTML("beforeend", html)
    })
})()