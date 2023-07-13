# @simply-dev/eslint-plugin

Base NX Eslint Config used within The Simply Initiative, also includes rules from `react-magnetic-di`;

## Installation

**Step 1**

_If you are in an NX workspace, you can normally skip this step_

Install the required packages for [ESLint](https://eslint.io/)

```sh
yarn add -D eslint
```

**Step 2**

Install this plugin

```sh
yarn add -D @simply-dev/eslint-plugin
```

## Usage

In your `eslint` config file merge the following config:

```js
// .eslint.js
module.exports = {
  extends: ['plugin:@tsi/nx'],
  plugins: ['@tsi'],

  // ... other config ...
};
```

This library was generated with [Nx](https://nx.dev).
