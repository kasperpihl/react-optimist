# react-optimist

## Installation

Using [npm](https://www.npmjs.com/):

    $ npm install --save react-optimist

Then with a module bundler like [webpack](https://webpack.github.io/), use as you would anything else:

```js
// using ES6 modules
import { withOptimist, OptimistKeeper } from 'react-optimist'

// using CommonJS modules
var withOptimist = require('react-optimist').withOptimist;
var OptimistKeeper = require('react-swiss').OptimistKeeper;
```

The UMD build is also available on [unpkg](https://unpkg.com):

```html
<script src="https://unpkg.com/react-optimist/dist/umd/optimist.min.js"></script>
```

You can find the library on `window.Optimist`.
