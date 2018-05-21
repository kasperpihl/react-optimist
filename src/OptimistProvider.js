import React, { PureComponent } from 'react';
import Context from './utils/getContext';

export default class extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: {
        set: this.onSet,
        get: this.onGet,
        _updatedKeyMap: {},
      },
    }
    this.data = {};
    this.queues = {};
    this.runningOptions = {};
  }
  onSet = (options) => {
    const { key, value, handler } = options;
    this.data[key] = value;
    this.updateStateForKey(key);
    this.addToQueue(options);
  }
  onGet = (key, fallback) => {
    if(typeof this.data[key] !== 'undefined') {
      return this.data[key];
    }
    if(typeof fallback !== 'undefined') {
      return fallback;
    }
    return;
  }
  onNext = (key, error) => {
    const options = this.runningOptions[key];
    delete this.runningOptions[key];
    if(!this.queues[key].length) {
      delete this.data[key];
      this.updateStateForKey(key);
    } else {
      this.runQueue(key);
    }
    
  }
  updateStateForKey(key) {
    this.state.value._updatedKeyMap[key] = new Date().toISOString(); 
    const newValue = Object.assign({}, this.state.value);
    this.setState( { value: newValue} );
  }
  addToQueue(options) {
    const { key } = options;
    if(!this.queues[key]) {
      this.queues[key] = [];
    }
    this.queues[key].push(options);
    this.runQueue(key);
  }
  runQueue(key) {
    if(this.runningOptions[key]) return;
    
    const options = this.queues[key].shift();
    this.runningOptions[key] = options;
    
    if(typeof options.handler !== 'function') {
      return this.onNext(key);
    }
    if(!options.handler.length) {
      throw new Error('react-optimist: handler must take a first argument (next).');
    }
    options.handler(this.onNext.bind(this, key));
  }
  render() {
    const { children } = this.props;
    return (
      <Context.Provider value={this.state.value}>
        {children}
      </Context.Provider>
    );
  }
}