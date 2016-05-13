(() =>
{
    "use strict"

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
})()