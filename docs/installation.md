# Installation
There are two ways to install react-optimist. 

1. Using [npm](https://www.npmjs.com/) (recommended):

`$ npm install --save react-optimist`

Then with a module bundler like [webpack](https://webpack.github.io/), use as you would anything else:

```js
// using ES6 modules
import { withOptimist, OptimistProvider } from 'react-optimist'

// using CommonJS modules
var withOptimist = require('react-optimist').withOptimist;
var OptimistProvider = require('react-swiss').OptimistProvider;
```

2. With an UMD build available on [unpkg](https://unpkg.com):

```html
<script src="https://unpkg.com/react-optimist/dist/umd/optimist.min.js"></script>
```

You can find the library on `window.Optimist`.
