export function create({data, options}) {
  let log = {
    log: [{
      event: {
        operation: {
          type: 'create',
          data
        }
      }
    }]
  };

  // set a previous log if there is one
  if(options?.previousLog) {
    log.previousLog = options.previousLog;
  }

  return log;
}

export function update({cel, data, options}) {
  // TODO: Calculate hash of previous event
  let previousEvent = 'TODO';

  // push event to end of log
  cel.log.push({
    event: {
      previousEvent,
      operation: {
        type: 'update',
        data
      }
    }
  });

  return log;
}

export default {create, update};
