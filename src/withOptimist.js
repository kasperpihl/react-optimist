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
    onIdentify = (id, options) => {
      if(typeof id === 'string') {
        this.id = id;
      } else if(typeof id === 'object') {
        options = id;
      }
      
      if(typeof options === 'object') {
        this.defaultOptions = options;
      }
    }
    onGet = (key, fallback) => {
      key = `${this.id}--${key}`;
      // Subscribe for changes
      if(this.subs.indexOf(key) === -1){
        this.subs.push(key);
      }
      return this.optimistProvider.get(key, fallback);
    }
    onSet = (key, value, handler) => {
      let options = key;
      if(typeof key === 'string') {
        options = { key, value, handler };
      }
      options.key = `${this.id}--${options.key}`;
      options = Object.assign({}, this.defaultOptions, options);
      return this.optimistProvider.set(options);
    }
    lazyLoadOptimist(optimistProvider) {
      if(!this.optimist) {
        this.optimistProvider = optimistProvider;
        this.lastUpdated = Object.assign({}, optimistProvider._updatedKeyMap);
        this.optimist = {
          identify: this.onIdentify
          get: this.onGet,
          set: this.onSet,
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
