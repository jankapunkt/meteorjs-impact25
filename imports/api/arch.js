export const isomorphic = ({ server, client }) => {
  if (Meteor.isServer) {
    return server();
  }
  if (Meteor.isClient) {
    return client();
  }
  throw new Error(`Unexpected architecture`);
}

