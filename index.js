const postcss = require('postcss');
const autoprefixer = require('autoprefixer');

const prefixer = postcss([autoprefixer({
    browsers: [
        'last 2 IE versions', 'not IE < 11',
        'last 2 Chrome versions', 'not Chrome < 61',
        'last 2 Safari versions', 'not Safari < 10.1',
        'last 2 iOS versions', 'not iOS < 10.3',
        'last 2 ChromeAndroid versions', 'not ChromeAndroid < 61'
    ],
    grid: true
})]);

module.exports = source => {
    const styleRegex = /<style>([\s\S]*?)<\/style>/gm;
    let styleResult = styleRegex.exec(source);

    if(!styleResult) {
        return source;
    }

    const tagNameRegex = /customElements\.define\('(.+?)'/gm;
    const tagName = tagNameRegex.exec(source)[1];
    const ruleRegex = /^(?!\s*(from|to))([\sa-zA-Z0-9\-_*()\[\]#.:,]*?){([\s\S]*?)}$/gm;
    const ruleStartRegex = /(\s+)([\s\S]*){/;
    const notHostOrSlottedRegex = /^(?!(:host|::slotted))[\s\S]*$/;
    const slottedRegex = /::slotted\((.+?)\)/gm;
    const hostRegex = /:host(\((.+?)\)(.+?)|\s){/gm;

    const orgStyle = styleResult[1];
    let style = styleResult[1];

    /**
     * Prefix all regular rules (not :host or ::slotted) with the tagname of the custom element
     */
    let ruleResult;

    do {
        ruleResult = ruleRegex.exec(style);

        if(ruleResult) {
            let ruleStartResult = ruleStartRegex.exec(ruleResult[0]);

            if(ruleStartResult) {
                let notHostResult = notHostOrSlottedRegex.exec(ruleStartResult[2]);

                if(notHostResult) {
                    const selectors = ruleStartResult[2].split(',');
                    const replacement = selectors.map(selector => `${tagName} ${selector.trim()}`).join(', ');
                    style = style.replace(ruleResult[0].trim(), `${replacement} {${ruleResult[3]}}`);
                }
            }
        }
    } while(ruleResult);


    /**
     * Replace all ::slotted rules with the tagname of the custom element
     */
    let slottedResult;

    do {
        slottedResult = slottedRegex.exec(style);

        if(slottedResult) {
            style = style.replace(slottedResult[0], `${tagName} ${slottedResult[1]}`);
        }
    } while(slottedResult);


    /**
     * Replace all :host rules with the tagname of the custom element
     */
    let hostResult;

    do {
        hostResult = hostRegex.exec(style);

        if(hostResult) {
            if(hostResult[2] === undefined) {
                hostResult[2] = '';
            }
            if(hostResult[3] === undefined) {
                hostResult[3] = hostResult[2] === '' ? ' ' : '';
            }
            style = style.replace(hostResult[0], `${tagName}${hostResult[2]}${hostResult[3]}{`);
        }
    } while(hostResult);


    const prefixed = prefixer.process(style).css;

    source = source.replace(orgStyle, prefixed);

    return source;
};
