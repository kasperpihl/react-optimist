import React, { PureComponent } from 'react';
import Context from './utils/getContext';

export default class extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: {
        push: this.onPush,
        queue: this.onQueue,
        get: this.onGet,
        _updatedKeyMap: {},
      },
    }
    this.data = {};
    this.queues = {};
    this.runningQueues = {};
  }
  onUpdate = (key, value) => {
    if(typeof value !== 'undefined') {
      this.data[key] = value;
    } else {
      delete this.data[key];
    }

    this.state.value._updatedKeyMap[key] = new Date().toISOString(); 
    const newValue = Object.assign({}, this.state.value);
    this.setState( { value: newValue} );
  }
  onQueue = (key, value, handler) => {
    this.onUpdate(key, value);
    this.onAddToQueue(key, handler);
  }
  onPush = (key, value, handler) => {
    this.onUpdate(key, value);
    this.onAddToQueue(key, handler, true);
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
    delete this.runningQueues[key];
    const { onError } = this.props;
    if(error || !this.queues[key].length) {
      this.onUpdate(key);
      error && onError && onError(key, error);
    } else {
      this.onRunQueue(key);
    }
  }
  onAddToQueue = (key, handler, replace) => {
    if(!this.queues[key] || replace) {
      this.queues[key] = [];
    }
    this.queues[key].push(handler);
    this.onRunQueue(key);
  }
  onRunQueue = (key) => {
    if(this.runningQueues[key]) return;
    this.runningQueues[key] = true;
    const handler = this.queues[key].shift();
    handler(this.onNext.bind(this, key));
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