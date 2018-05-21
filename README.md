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
Main API:
- [optimist.set(options)](#optimistsetoptions) - queue optimistic requests
- [optimist.get(key, [fallback])](#optimistgetkey-fallback) - get optimistic values
Advanced:
- [optimist.setDefaultOptions(options)](#optimistsetdefaultoptionsoptions) - identify future calls and set default options
- [optimist.identify(id)](#optimistidentifyid) - identify future calls and set default options


## optimist.set(options)
**Params**
- options `object` - An option object

| Option | Type | Default value | Description |
| --- | --- | --- | --- |
| key | string | **(required)** | A key for the queue (ex: goal-reorder, task-119-complete) |
| value | any | **(required)** | The value trying to be sent to the server and that should be used (optimistic) |
| handler | function | **(required)** | The async handler, (next) => {}, you must call next when done |
| serial | bool | false | Run all requests added to this queue, not just the last. |
| clearOnError | boolean | true | When you return an error to next, wipe future requests |
| debounce (coming soon) | number | 0 (ms) | Postpone the server request with x ms from now |
| throttle (coming soon) | number | 0 (ms) | Run server requests every x ms |


## optimist.get(key, [fallback])
Retreive the current optimistic value or an optional fallback value. 

**Params**
- key `string` - entry for the store
- fallback `any value` - value to be used if nothing is in store

**Returns**: `store value or fallback`

## optimist.setDefaultOptions(options)
This will set default options for future calls to set/get.

**Params**
- options `object` - An option object defining defaults, see optimist.set above for supported props.

## optimist.identify(id)
This will prepend id for calls to set/get. **Not required to run this first**

**Params**
- id `string` - An id to prepend future calls to optimist.set (useful for id of a task/project/etc)

# Other projects
Built for and maintained by [Swipes](https://swipesapp.com)

- [swiss-react](https://github.com/swipesapp/react-swiss) - A CSS-in-js solution with sass-like features and an epic syntax.
