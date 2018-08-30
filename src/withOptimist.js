import React, { PureComponent } from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import Context from './utils/getContext';

export default (WrappedComponent) => {

  // Wrapper used to only update based on subscriptions
  class PureWrapper extends PureComponent {
    render() {
      return (
        <WrappedComponent {...this.props} />
      )
    }
  }
  class OptimistWrapper extends PureComponent {
    constructor(props) {
      super(props);
      this.subs = [];
      this.defaultOptions = {};
      this.id = '';
    }
    onIdentify = (id) => {
      if(typeof id !== 'string') {
        throw new Error('optimist.identify expects a string');
      }
      this.id = id;
    }
    onGet = (key, fallback) => {
      key = `${this.id}--${key}`;
      // Subscribe for changes
      if(this.subs.indexOf(key) === -1){
        this.subs.push(key);
      }
      return this.optimistProvider.get(key, fallback);
    }
    onSet = (options, value, handler) => {
      if(typeof options === 'string') {
        options = {
          key: options,
          value,
          handler,
        }
      }
      if(typeof options !== 'object') {
        throw new Error('optimist.set expects an object');
      }
      options.key = `${this.id}--${options.key}`;

      return this.optimistProvider.set(Object.assign(
        {},
        this.optimistProvider.defaultOptions, 
        this.defaultOptions,
        options
      ));
    }
    onUnset = (key) => {
      if(typeof key !== 'string') {
        throw new Error('optimist.unset expects a key (string)');
      }
      return this.optimistProvider.unset(`${this.id}--${key}`);
    }
    onSetDefaultOptions = (options) => {
      if(typeof options === 'object') {
        this.defaultOptions = options;
      }
    }
    lazyLoadOptimist(optimistProvider) {
      if(!this.optimist) {
        this.optimistProvider = optimistProvider;
        this.lastUpdated = Object.assign({}, optimistProvider._updatedKeyMap);
        this.optimist = {
          identify: this.onIdentify,
          get: this.onGet,
          set: this.onSet,
          unset: this.onUnset,
          setDefaultOptions: this.onSetDefaultOptions,
        };
      }
    }
    determineShouldUpdate(optimistProvider) {
      const shouldUpdate = !!this.subs.filter((key) => (
        this.lastUpdated[key] !== optimistProvider._updatedKeyMap[key]
      )).length;

      this.lastUpdated = Object.assign({}, optimistProvider._updatedKeyMap);
      
      this.optimist._updatedKeyMap = optimistProvider._updatedKeyMap;

      return shouldUpdate;
    }
    renderInner(optimistProvider) {
      this.lazyLoadOptimist(optimistProvider);
      
      if(this.determineShouldUpdate(optimistProvider)) {
        // Here we force the pure render to happen by creating a new object.
        this.optimist = Object.assign({}, this.optimist);
      }
      return (
        <PureWrapper
          optimist={this.optimist}
          {...this.props}
        />
      )
    }
    render() {
      return (
        <Context.Consumer>
          {(optimistProvider) => this.renderInner(optimistProvider)}
        </Context.Consumer>
      );
    }
  }
  hoistNonReactStatics(OptimistWrapper, WrappedComponent);
  hoistNonReactStatics(PureWrapper, WrappedComponent);
  return OptimistWrapper;

}
