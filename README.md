# react-optimist
Welcome to React Optimist. A simple API for optimistic UI, using React and taking advantage of the [new Context API](https://reactjs.org/docs/context.html).
Built for and maintained by [Swipes](https://swipesapp.com)

## Installation
```
$ npm install --save react-optimist
```
See all [installation options](https://github.com/swipesapp/react-optimist/blob/master/docs/installation.md)

## Usage
react-optimist consist of two API's:  
### OptimistProvider
OptimistProvider is a highlevel react class that needs to be added once, similar to Provider from redux, BrowserRouter from react-router and so on.

```js
// Somewhere like App.js or Root.js etc.
import { OptimistProvider } from 'react-optimist';

render(
  <OptimistProvider>
    <App />
  </OptimistProvider>
)
```

### withOptimist
withOptimist is a higher-order-component (HOC) that you wrap any class that either needs to access to the optimistic data, or will be creating it (or both :).

```
withOptimist(Component)
```
This inject a prop "optimist" into the wrapped component.


## Other projects built for and maintained by [Swipes](https://swipesapp.com)
[swiss-react](https://github.com/swipesapp/react-swiss) - A CSS-in-js solution with sass-like features and an epic syntax.