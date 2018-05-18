import React, { PureComponent } from 'react';
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
  return class extends PureComponent {
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
    onPush = (...args) => {
      this.onSubscribe(args[0]);
      this.originalOptimist.push(...args);
    }
    onReplace = (...args) => {
      this.onSubscribe(args[0]);
      this.originalOptimist.replace(...args);
    }
    lazyLoadOptimist(optimist) {
      if(!this.optimist) {
        this.originalOptimist = optimist;
        this.lastUpdated = Object.assign({}, optimist._updatedKeyMap);
        this.optimist = {
          get: optimist.get,
          push: this.onPush,
          replace: this.onReplace,
          subscribe: this.onSubscribe,
          unsubscribe: this.onUnsubscribe,
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

}
