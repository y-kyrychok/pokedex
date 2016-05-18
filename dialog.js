(() =>
{
    "use strict"

    if (typeof HTMLDialogElement == "undefined")
        return

    let {prototype} = HTMLDialogElement
    let {show} = prototype

    prototype.show = function(anchor)
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

        return show.apply(this, arguments)
    }
})()