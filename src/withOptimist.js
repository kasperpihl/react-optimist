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
    }
    onSubscribe = (...keys) => {
      keys.forEach((key) => {
        if(this.subs.indexOf(key) === -1){
          this.subs.push(key);
        }
      });
    }
    onUnsubscribe = (...keys) => {
      this.subs = this.subs.filter(s => keys.indexOf(s) === -1); 
    }
    onGet = (...args) => {
      this.onSubscribe(args[0]);
      return this.originalOptimist.get(...args);
    }
    lazyLoadOptimist(optimist) {
      if(!this.optimist) {
        this.originalOptimist = optimist;
        this.lastUpdated = Object.assign({}, optimist._updatedKeyMap);
        this.optimist = {
          get: this.onGet,
          push: optimist.push,
          queue: optimist.queue,
        };
      }
    }
    determineShouldUpdate(optimist) {
      let shouldUpdate;
      this.subs.forEach((key) => {
        if(this.lastUpdated[key] !== optimist._updatedKeyMap[key]) {
          shouldUpdate = true;
        }
      })
      this.lastUpdated = Object.assign({}, optimist._updatedKeyMap);
      
      this.optimist._updatedKeyMap = optimist._updatedKeyMap;

      return shouldUpdate;
    }
    renderInner(optimist) {
      this.lazyLoadOptimist(optimist);
      
      if(this.determineShouldUpdate(optimist)) {
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
          {(optimist) => this.renderInner(optimist)}
        </Context.Consumer>
      );
    }
  }
  hoistNonReactStatics(OptimistWrapper, WrappedComponent);
  hoistNonReactStatics(PureWrapper, WrappedComponent);
  return OptimistWrapper;

}
