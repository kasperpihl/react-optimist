Welcome to React Optimist. A simple API for optimistic UI, using React and taking advantage of the [new Context API](https://reactjs.org/docs/context.html).
Built for and maintained by [Swipes](https://swipesapp.com)

# Idea
A user clicks on a button, you want to save the new state to a server, but you don't want to show a loader in the meantime. react-optimist let's you easily queue requests in the background while showing the new value. Also known as optimistic ui.

# Installation [(more options)](https://github.com/swipesapp/react-optimist/blob/master/docs/installation.md)
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

# The optimist object API
The optimist object injected into your components has a simple api:
- [optimist.identify(id, [options])](https://github.com/swipesapp/react-optimist/blob/master/README.md#optimistidentify-options) - identify future calls and set default options
- [optimist.set(options)](https://github.com/swipesapp/react-optimist/blob/master/README.md#optimistsetoptions) - queue optimistic requests
- [optimist.set(key, value, handler) (shorthand)](https://github.com/swipesapp/react-optimist/blob/master/README.md#optimistsetkey-value-handlershorthand)
- [optimist.get(key, [fallback])](https://github.com/swipesapp/react-optimist/blob/master/README.md#optimistgetkey-fallback) - get optimistic values

## optimist.identify(id, [defaultOptions])
This will prepend id and set default options for future calls to set/get. **Not required to run this first**

**Params**
- id `string` - An id to prepend future calls to optimist.set (useful for id of a task/project/etc) 
- defaultOptions `object` - An option object defining defaults, see optimist.set below for API.

## optimist.set(options)
**Params**
- options `object` - entry for the store

| Option | Type | Default value | Description |
| --- | --- | --- | --- |
| key | string | **(required)** | A key for the queue (ex: goal-reorder, task-119-complete) |
| value | any | **(required)** | The value trying to be sent to the server and that should be used (optimistic) |
| handler | function | **(required)** | The async handler, (next) => {}, you must call next when done |
| serial | bool | false | Run all requests added to this queue, not just the last. |
| debounce | number | 0 (ms) | Postpone the server request with x ms from now |
| throttle | number | 0 (ms) | Run server requests every x ms |
| clearOnError | boolean | true | When you return an error to next, wipe future requests |

## optimist.set(key, value, handler) (shorthand)
Like the push above, but with the required options filled out for key, value and handler.

**Params**
- key `string` - A key for the queue (ex: goal-reorder, task-119-complete)
- value `any value` - The value trying to be sent to the server and that should be used (optimistic)
- handler `function` - The async handler, (next) => {}, you must call next when done.

## optimist.get(key, [fallback])
Retreive the current optimistic value or an optional fallback value. 

**Params**
- key `string` - entry for the store
- fallback `any value` - value to be used if nothing is in store

**Returns**: `store value or fallback`

# Other projects
Built for and maintained by [Swipes](https://swipesapp.com)

- [swiss-react](https://github.com/swipesapp/react-swiss) - A CSS-in-js solution with sass-like features and an epic syntax.
