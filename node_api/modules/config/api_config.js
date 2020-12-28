let config = {};

const apiKeys = new Map();
apiKeys.set('D8FE58CD2CD97A17E5227B11A95E7', {
  id: 1,
  name: 'dev'
});
apiKeys.set('E96678115C3F9E7FB237B8EEC33D3', {
    id: 2,
    name: 'prod'
  });

config.apiKeys = apiKeys;
config.port = 4000;
config.host = "localhost";

module.exports = config;