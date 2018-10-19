const loader = require('../index');
const expect = require('chai').expect;

describe('custom-elements-css-loader', () => {

    const getSource = css => `
        export default class CustomElement extends HTMLElement {

            constructor() {
                super();
        
                const shadowRoot = this.attachShadow({mode: 'open'});
        
                shadowRoot.innerHTML = \`
                    <style>
                        ${css}
                    </style>\`
            }
        }
        
        customElements.define('custom-element', CustomElement);
    `;

    it('should prefix regular rules with the tag name of the custom element', () => {
        const css = `
            #container {
                display: block;
                background: #000000;
            }
            
            .content {
                display: flex;
                color: #ffffff;
            }
            
            header, footer p, .sidebar {
                padding: 10px;
            }
        `;

        const processedCss = `
            custom-element #container {
                display: block;
                background: #000000;
            }
            
            custom-element .content {
                display: flex;
                color: #ffffff;
            }
            
            custom-element header, custom-element footer p, custom-element .sidebar {
                padding: 10px;
            }
        `;

        const actual = loader(getSource(css));
        const expected = getSource(processedCss);

        expect(actual).to.eql(expected);
    });

    it('should replace :host with the tag name of the custom element', () => {
        const css = `
            :host {
                display: block;
                width: 100%;
                height: 100%;
            }
            
            :host([value]) {
                font-size: 1em;
            }
            
            :host([value]) h1 {
                font-family: verdana;
            }
        `;

        const processedCss = `
            custom-element {
                display: block;
                width: 100%;
                height: 100%;
            }
            
            custom-element[value] {
                font-size: 1em;
            }
            
            custom-element[value] h1 {
                font-family: verdana;
            }
        `;

        const actual = loader(getSource(css));
        const expected = getSource(processedCss);

        expect(actual).to.eql(expected);
    });


    it('should replace ::slotted with the tag name of the custom element', () => {
        const css = `
            ::slotted(a) {
                display: block;
                cursor: pointer;
            }
        `;

        const processedCss = `
            custom-element a {
                display: block;
                cursor: pointer;
            }
        `;

        const actual = loader(getSource(css));
        const expected = getSource(processedCss);

        expect(actual).to.eql(expected);
    });
});
