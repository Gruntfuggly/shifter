# Shifter

Allows arguments (or other comma separated lists contained in brackets, braces, etc.) to be shifted left and right.

<img src="https://raw.githubusercontent.com/Gruntfuggly/shifter/master/shifter.gif">

By default it defines "Alt+S Left" and "Ctrl+Alt+Left" to move arguments left and "Alt+S Right" and "Ctrl+Alt+Right" to move them right. You can also use the commands "Shift argument to the left" and "Shift argument to the right" from the command menu.

## Installing

You can install the latest version of the extension via the Visual Studio Marketplace [here](https://marketplace.visualstudio.com/items?itemName=Gruntfuggly.shifter).

Alternatively, open Visual Studio code, press `Ctrl+P` or `Cmd+P` and type:

    > ext install shifter

### Source Code

The source code is available on GitHub [here](https://github.com/Gruntfuggly/shifter).

## Known Issues

Depending on your formatting settings, you might see an extra space here and there. It's too difficult to second guess the format of the list, so you'll have to rely on your formatter to fix it up after shifting.

It detects the arguments by simply searching for commas within the bracket scope. It's not clever enough to spot commas inside strings, or nested arguments, for example.

### Credits

<div>Icon made by <a href="https://www.flaticon.com/authors/retinaicons" title="Retinaicons">Retinaicons</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>

This extension resues parts of [Scoper](https://marketplace.visualstudio.com/items?itemName=Gruntfuggly.scoper) which in turn was based on Chunsen Wang's [Bracket Select](https://marketplace.visualstudio.com/items?itemName=chunsen.bracket-select) extension.