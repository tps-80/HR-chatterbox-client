var PostModel = Backbone.Model.extend({
  defaults: {
    createdAt: null,
    objectId: null,
    roomname: null,
    text: null,
    updatedAt: null,
    username: null
  }
});

var PostsCollection = Backbone.Collection.extend({
  initialize: function() {
    this.fetch({
      data: {order: '-createdAt'},
      success: function(posts) {
        var render = new PostsView({collection: posts});
      }
    })  
  },
  url: 'https://api.parse.com/1/classes/chatterbox',
  model: PostModel,
  parse: function(data) {
    return data.results;
  }
});

var PostView = Backbone.View.extend({
  initialize: function() {
    this.on('change', this.render, this)
  },

  template: _.template($('#messageViewTemplate').html()),

  render: function(posts) {
    this.$el.html(this.template(this.model.attributes));
    return this.$el;
  }
});

var PostsView = Backbone.View.extend({

  initialize: function() {
    this.collection.on('sync', this.render, this),
    this.onScreenPosts = {}
  },

  render: function() {
    this.collection.forEach(this.renderPost, this);
  },

  renderPost: function(post) {
    if (!this.onScreenPosts[post.get('objectId')]) {
      var postView = new PostView({model: post});
      this.$el.prepend(postView.render());
      this.onScreenPosts[post.get('objectId')] = true;
    }
  }
});

$(document).ready(function(){
  var posts = new PostsCollection();

  // setInterval(function(){
  //   posts.fetch({update: true});
  //   console.log(posts.length);
  // }, 1000);

});