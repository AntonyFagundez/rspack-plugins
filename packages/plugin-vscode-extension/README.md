# rspack-plugin-vscode-extension

A plugin for rspack that allows you use rspack for vscode extensions development.

## Installation

```bash
# npm
npm install rspack-plugin-vscode-extension
# yarn
yarn add rspack-plugin-vscode-extension
# pnpm
pnpm add rspack-plugin-vscode-extension
```

## Usage

```js
const { RspackVsCodeExtensionPlugin } = require('rspack-plugin-vscode-extension');
// rspack.config.js
module.exports = {
  plugins: [
    new RspackVsCodeExtensionPlugin(),
  ],
};
```

If you want to add externals to the config you can add:

```js
// rspack.config.js
const { RspackVsCodeExtensionPlugin } = require('rspack-plugin-vscode-extension');

const vmp = new RspackVsCodeExtensionPlugin({
  externals: {
    // add any other external necesary We can overwrite the default
  }
});


module.exports = {
  plugins: [vmp],
};
```
