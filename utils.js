const admin = member => member.roles.cache.find(role => role.name == 'admin');

module.exports = admin;