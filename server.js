var mosca = require('mosca');

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 1883;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0..0.1';

var db_name = 'lightbox';

var mongodb_connection_string = 'mongodb://127.0.0.1:27017/' + db_name;

if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
  mongodb_connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
  process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
  process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
  process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
  process.env.OPENSHIFT_APP_NAME;
}
var pubsubsettings = {
  type: 'mongo',
  url: mongodb_connection_string,
  pubsubCollection: 'lightbox',
  mongo: {}
};
 
var settings = {
  port: server_port,
  //host: server_ip_address,
  backend: pubsubsettings
};
 
//here we start mosca
var server = new mosca.Server(settings);
server.on('ready', setup);
 
// fired when the mqtt server is ready
function setup() {
  console.log('Mosca server is up and running on ' + server_ip_address + ', server port: '+ server_port);
}
 
// fired when a  client is connected
server.on('clientConnected', function(client) {
  console.log('client connected', client.id);
});
 
// fired when a message is received
server.on('published', function(packet, client) {
  console.log('Published : ', packet.payload);
});
 
// fired when a client subscribes to a topic
server.on('subscribed', function(topic, client) {
  console.log('subscribed : ', topic);
});
 
// fired when a client subscribes to a topic
server.on('unsubscribed', function(topic, client) {
  console.log('unsubscribed : ', topic);
});
 
// fired when a client is disconnecting
server.on('clientDisconnecting', function(client) {
  console.log('clientDisconnecting : ', client.id);
});
 
// fired when a client is disconnected
server.on('clientDisconnected', function(client) {
  console.log('clientDisconnected : ', client.id);
});