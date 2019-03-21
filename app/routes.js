var handlers = require("./handlers.js");

var public_dir = __dirname + "/../public";

var routes = [
  {
    method: "GET",
    path: "/",
    handler: function(req, reply){
      reply.file(public_dir + "/login.html");
    }
  },
  {
    method: "GET",
    path: "/{path*}",
    handler: function(req, reply){
      reply.file(public_dir + "/" + req.params.path);
    }
  },
  {
    method: "POST",
    path: "/login",
    handler: handlers.login
  },
  {
    method: "GET",
    path: "/main",
    handler: function(req, reply){
      reply.file(public_dir + "/index.html");
    }
  },
  {
    method: "GET",
    path: "/about",
    handler: function(req, reply){
      reply.file(public_dir + "/about.html");
    }
  },
  {
    method: "GET",
    path: "/search",
    handler: function(req, reply){
      reply.file(public_dir + "/index.html");
    }
  },
  {
    method: "POST",
    path: "/saveProfile",
    handler: handlers.saveProfile
  },
  {
    method: "POST",
    path: "/returnSearch",
    handler: handlers.returnSearch
  },
  {
    method: "POST",
    path: "/location",
    handler: handlers.getLocation
  },
  {
    method: "POST",
    path: "/sendMessage",
    handler: handlers.sendMessage
  },
  {
    method: "POST",
    path: "/getProfileDetails",
    handler: handlers.getProfileDetails
  },
  {
    method: "POST",
    path: "/addStar",
    handler: handlers.addStar
  },
  {
    method: "POST",
    path: "/removeStar",
    handler: handlers.removeStar
  },
  {
    method: "GET",
    path: "/settings.js",
    handler: handlers.getSettings
  }
];

module.exports = routes;
