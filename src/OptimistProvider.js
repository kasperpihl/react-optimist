import React, { Component } from "react";
import Context from "./utils/getContext";

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: {
        set: this.onSet,
        get: this.onGet,
        unset: this.onUnset,
        _updatedKeyMap: {},
        defaultOptions: Object.assign(
          {
            serial: false,
            debounce: 0,
            throttle: 0,
            clearOnError: true
          },
          props.defaultOptions
        )
      }
    };
    this.data = {};
    this.queues = {};
    this.runningOptions = {};
  }
  onSet = options => {
    const { key, value, handler } = options;
    this.data[key] = value;
    this.updateStateForKey(key);
    if (typeof handler === "function") {
      this.addToQueue(options);
    } else {
      return this.onNext.bind(this, key);
    }
  };
  onUnset = key => {
    delete this.data[key];
    delete this.runningOptions[key];
    delete this.queues[key];
    this.updateStateForKey(key);
  };
  onGet = (key, fallback) => {
    if (typeof this.data[key] !== "undefined") {
      return this.data[key];
    }
    return fallback;
  };
  onNext = (key, error) => {
    if (!this.runningOptions[key]) return false;
    const options = this.runningOptions[key];
    delete this.runningOptions[key];
    if (error) {
      this.handleError(options, error);
    } else if (!this.queues[key].length) {
      delete this.data[key];
      this.updateStateForKey(key);
    } else {
      this.runQueue(key);
      return true; // Has more.
    }
    return false;
  };
  handleError(options, error) {
    const { clearOnError } = options;
    if (clearOnError) {
      this.queues[key] = [];
      delete this.data[key];
      this.updateStateForKey(key);
    } else {
      this.queues[key] = [options].concat(this.queues[key]);
      console.log(
        "not sure yet what to do here. (on error without clearOnError)",
        error
      );
      // What should I do in case of an error and behaviour is not to clear??..
      /*
        I'm thinking calling an error handler with a retry callback.
        Then 
      */
    }
  }
  updateStateForKey(key) {
    this.state.value._updatedKeyMap[key] = new Date().toISOString();
    const newValue = Object.assign({}, this.state.value);
    this.setState({ value: newValue });
  }
  addToQueue(options) {
    const { key, serial } = options;
    if (!this.queues[key] || !serial) {
      this.queues[key] = [];
    }
    this.queues[key].push(options);
    this.runQueue(key);
  }
  runQueue(key) {
    if (this.runningOptions[key]) return;

    const options = this.queues[key].shift();
    this.runningOptions[key] = options;

    if (typeof options.handler !== "function") {
      return this.onNext(key);
    }
    options.handler(this.onNext.bind(this, key));
  }
  render() {
    const { children } = this.props;
    return (
      <Context.Provider value={this.state.value}>{children}</Context.Provider>
    );
  }
}
