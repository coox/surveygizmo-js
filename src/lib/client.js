import config from 'config';

const init = (options = {}) => {
  const client = Object.assign({}, config, options);

  return client;
};

export default {
  init,
};
