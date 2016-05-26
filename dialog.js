(() =>
{
    "use strict"

    if (typeof HTMLDialogElement == "undefined")
        return

    let {prototype} = HTMLDialogElement

    for (let key of [ "show", "showModal" ])
    {
        let method = prototype[key]

        prototype[key] = function(anchor)
        {
            if (anchor instanceof MouseEvent)
            {
                let {pageX, pageY} = anchor

                this.style = `
                    position: absolute;
                    top: ${pageY}px;
                    left: ${pageX}px;
                `
            }
            else if (anchor instanceof Element)
            {
                ///
            }

            return method.apply(this, arguments)
        }
    }
})()