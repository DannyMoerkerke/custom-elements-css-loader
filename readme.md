# Custom elements CSS loader

This is a webpack loader which fixes CSS inside Custom Elements Shadow
DOM for browsers that don't support
[Custom Elements V1](https://caniuse.com/#feat=custom-elementsv1)

The creation of Custom Elements (Web Components) can easily be polyfilled
with webcomponentsjs but to make sure that the CSS inside Shadow DOM
works correctly, the Shady CSS polyfill will need to be used which means
that the source code will also need some modification.

I found this undesirable so I created a Webpack loader to fix this.

It basically does two things:

It prefixes all CSS rules inside the Shadow DOM of your web component
that do not start with `::host` or `::slotted` with the tagname of the
element to provide proper scoping.
After that it parses all `::host` and `::slotted` rules to make sure
these also work correctly.

## How to use
Install with npm:

`npm install custom-elements-css-loader`

Then add the loader to your webpack config:

```
module.exports = {
    ...

    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    {
                        loader: 'custom-elements-css-loader'
                    }
                ],

            }
        ]
    }
    ...

}
```

### Testing
To run the tests:

`npm test`


