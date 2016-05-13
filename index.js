(() =>
{
    "use strict"

    const api = "http://pokeapi.co/api/v1"

    let request = new XMLHttpRequest
        request.responseType = "json"
        request.open("GET", `${api}/pokemon?limit=12`)
        request.send()
})()