const { execSync } = require('child_process');
const { readFileSync, writeFileSync, unlinkSync } = require('fs');
const { JSDOM } = require('jsdom');

/**
 * @type {Document}
 */
let document;

const FILE_IN_FAVICON_DESCR_JSON = 'faviconDescription.json';
const FILE_OUT_FAVICON_DATA_JSON = 'faviconData.json';
const FILE_OUT_FAVICON_HTML = 'html_code.html';
const FILE_OUT_MANIFEST = 'site.webmanifest';
const DIR_OUT_OUTPUT = 'src/assets/favicon';

const FILE_APP_MANIFEST = 'manifest.webmanifest';

const prepareIconGeneration = () => {
    console.log(`Preparing ${FILE_IN_FAVICON_DESCR_JSON}...`);
    const favDescrJSON = readFileSync(`${FILE_IN_FAVICON_DESCR_JSON}`, 'utf-8');
    const favDescr = JSON.parse(favDescrJSON);

    try {
        const versionStr = favDescr.versioning.paramValue;
        const version = Number(versionStr) + 1;
        favDescr.versioning.paramValue = version;
        const favDescrJSONOut = JSON.stringify(favDescr, null, 2);

        writeFileSync(FILE_IN_FAVICON_DESCR_JSON, favDescrJSONOut, { encoding: 'utf-8', });

        console.log('Done.');
    } catch (e) {
        console.warn(e);
        console.warn(`${FILE_IN_FAVICON_DESCR_JSON}'s version could not be updated.`);
    }
}

const generateIcons = () => {
    console.log(`Generating icons to [${DIR_OUT_OUTPUT}]`);
    execSync(`npm run real-favicon generate ${FILE_IN_FAVICON_DESCR_JSON} ${FILE_OUT_FAVICON_DATA_JSON} ${DIR_OUT_OUTPUT}`);
    const favDataJSON = readFileSync(`${FILE_OUT_FAVICON_DATA_JSON}`, 'utf-8');
    const favData = JSON.parse(favDataJSON);
    const isOk = favData?.result?.status === 'success';
    if (!isOk) {
        throw new Error(`Favicon was not generated. Check logs, console output and ${FILE_OUT_FAVICON_DATA_JSON} for more info.`);
    }

    console.log('Generated.');
}
const setupIndexHtml = () => {
    console.log('Setting up the index.html file.');

    console.log('Reading web app\'s index.html content...');
    const indexHtml = readFileSync('src/index.html', 'utf-8');
    const jsDom = new JSDOM(indexHtml);
    document = jsDom.window.document;
    const indexHead = document.querySelector('head');
    if (indexHead == null) {
        console.log(indexHtml);
        throw new Error('Index\'s head could not be parsed.');
    }

    console.log('Reading generated HTML content...');
    const generatedHtml = readFileSync(`${DIR_OUT_OUTPUT}/${FILE_OUT_FAVICON_HTML}`, 'utf-8');
    console.log('Generated:');
    console.log(generatedHtml);
    const generatedContainer = document.createElement('div');
    generatedContainer.innerHTML = generatedHtml;

    console.log('');
    console.log('Updating <link> tags...');
    const elLinks = generatedContainer.querySelectorAll('link');
    for (let elIndex = 0; elIndex < elLinks.length; elIndex++) {
        const element = elLinks.item(elIndex);
        setupIndexHtml_SetupLink(element, indexHead);
    }

    console.log('');
    console.log('Updating <meta> tags...');
    const elMetas = generatedContainer.querySelectorAll('meta');
    for (let elIndex = 0; elIndex < elMetas.length; elIndex++) {
        const element = elMetas.item(elIndex);
        setupIndexHtml_SetupMeta(element, indexHead);
    }

    console.log('Writing down updated index.html...');
    const resultIndexHTML = jsDom.serialize();
    console.log(resultIndexHTML)
    writeFileSync('src/index.html', resultIndexHTML, { encoding: 'utf-8', });

    console.log('Index.html has been updated.');
}
/**
 * @param {HTMLLinkElement} newLink
 * @param {HTMLHeadElement} indexHead
 */
const setupIndexHtml_SetupLink = (newLink, indexHead) => {
    /** @type {string} */
    let querySelector;
    const rel = newLink.rel;
    const sizes = newLink.getAttribute('sizes');
    const type = newLink.type;

    switch (newLink.rel) {
        case 'apple-touch-icon':
            querySelector = `link[rel="${rel}"]`;
            break;
        case 'icon':
            querySelector = `link[rel="${rel}"][sizes="${sizes}"][type="${type}"]`;
            break;
        case 'manifest':
            // Skip manifest (we use our own, we just need to update it)
            return;
        case 'mask-icon':
        case 'shortcut icon':
            querySelector = `link[rel="${rel}"]`;
            break;
        default:
            throw new Error(`Link rel [${rel}] not supported.`)
    }

    /**
     * @type {HTMLLinkElement}
     */
    const linkAtIndex = indexHead.querySelector(querySelector);
    console.log(newLink.outerHTML);
    if (linkAtIndex == null) {
        console.log(`\tCreated`);
        // If data has not been modified, addit to the DOM
        newLink.parentElement.removeChild(newLink);
        indexHead.appendChild(newLink);
    } else {
        console.log(`\tModified`);
        // If data has been modified, set it up
        copyAttributes(newLink, linkAtIndex);
    }
};
/**
 * @param {HTMLMetaElement} newMeta
 * @param {HTMLHeadElement} indexHead
 */
const setupIndexHtml_SetupMeta = (newMeta, indexHead) => {
    /** @type {string} */
    let querySelector;
    const name = newMeta.getAttribute('name');
    switch (newMeta.rel) {
        default:
            querySelector = `meta[name="${name}"]`;
            break;
        // default:
        //     throw new Error(`Meta rel [${newMeta.rel}] not supported.`)
    }

    /**
     * @type {HTMLLinkElement}
     */
    const linkAtIndex = indexHead.querySelector(querySelector);
    console.log(newMeta.outerHTML);
    if (linkAtIndex == null) {
        console.log(`\tCreated`);
        // If data has not been modified, addit to the DOM
        newMeta.parentElement.removeChild(newMeta);
        indexHead.appendChild(newMeta);
    } else {
        console.log(`\tModified`);
        // If data has been modified, set it up
        copyAttributes(newMeta, linkAtIndex);
    }
};
/**
 * 
 * @param {HTMLElement} fromElement 
 * @param {HTMLElement} toElement
 */
const copyAttributes = (fromElement, toElement) => {
    for (let attrIndex = 0; attrIndex < fromElement.attributes.length; attrIndex++) {
        const attr = fromElement.attributes.item(attrIndex);
        toElement.setAttribute(attr.name, attr.value);
    }
};

const setupManifest = () => {
    console.log('Setting up web app manifest...');
    console.log('Reading new manifest...');
    const newManifestJSON = readFileSync(`${DIR_OUT_OUTPUT}/${FILE_OUT_MANIFEST}`);
    const newManifest = JSON.parse(newManifestJSON);

    console.log('Reading web app\'s manifest...');
    const appManifestJSON = readFileSync(`src/${FILE_APP_MANIFEST}`);
    const appManifest = JSON.parse(appManifestJSON);

    console.log('Merging manifest resources...');
    appManifest.icons = newManifest.icons;

    console.log('Writing down merged manifest...');
    const resultManifestJSON = JSON.stringify(appManifest, null, 2);
    writeFileSync(`src/${FILE_APP_MANIFEST}`, resultManifestJSON, { encoding: 'utf-8', });

    console.log('Manifest updated.');
};

const cleanupOutputDirectory = () => {
    console.log(`Cleanning up [${DIR_OUT_OUTPUT}]...`);
    const garbageFiles = [
        FILE_OUT_FAVICON_HTML,
        'README.md',
        'site.webmanifest'
    ];

    for (const file of garbageFiles) {
        unlinkSync(`${DIR_OUT_OUTPUT}/${file}`);
    }
}

const run = () => {
    try {
        prepareIconGeneration();
        console.log('');
        generateIcons();
        console.log('');
        setupIndexHtml();
        console.log('');
        setupManifest();
    } finally {
        console.log('');
        cleanupOutputDirectory();
    }
};

run();
