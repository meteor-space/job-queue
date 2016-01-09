Space.jobQueue.InconsistentStateError = Space.Error.extend(Space.jobQueue, 'InconsistentStateError', {
  Constructor(stateChange, currentState) {
    Space.Error.call(this, `Not expecting the queue to be ${stateChange} when in ${currentState} state`);
  }
});
