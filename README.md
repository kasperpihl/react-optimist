Welcome to React Optimist. A simple API for optimistic UI, using React and taking advantage of the [new Context API](https://reactjs.org/docs/context.html).
Built for and maintained by [Swipes](https://swipesapp.com)

# Idea
A user clicks on a button, you want to save the new state to a server, but you don't want to show a loader in the meantime. react-optimist let's you easily queue requests in the background while 

# Installation [more options](https://github.com/swipesapp/react-optimist/blob/master/docs/installation.md)
```
$ npm install --save react-optimist
```

# High level
react-optimist consist of two high level API's:
- OptimistProvider is a react class that needs to be added once, similar to Provider (redux), BrowserRouter (react-router) and so on.
- withOptimist is a higher-order-component (HOC) that you wrap any class that either needs to access to the optimistic data, or will be creating it (or both :). It injects a prop "optimist" into the wrapped component.

```
withOptimist(Component) >> this.props.optimist
```

# API
The optimist object injected into your components has a simple api:
- optimist.push(options)
- optimist.push(key, value, handler) (shorthand)
- optimist.get(key, [fallback])

## optimist.push(options)

## optimist.push(key, value, handler) (shorthand)

## optimist.get(key, [fallback])
Retreive the current offline value or an optional fallback value. 

**Params**
- key `string` - entry for the store
- fallback `any value` - value to be used if nothing is in store

**Returns**: `store value or fallback`


# Other projects
Built for and maintained by [Swipes](https://swipesapp.com)

- [swiss-react](https://github.com/swipesapp/react-swiss) - A CSS-in-js solution with sass-like features and an epic syntax.