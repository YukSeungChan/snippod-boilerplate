'use strict';

var Reflux = require('reflux'),
    Im = require('immutable'),
    { isInBag } = require('../utils/StoreUtils'),
    PostsActions = require('../../actions/posts/PostsActions');

var PostStore = Reflux.createStore({

  listenables: PostsActions,

  init: function() {
    this._posts = Im.Map({});
  },

  get: function(id) {
    return this._posts.get(id);
  },

  contains(id, fields) {
    return isInBag(this._posts, id, fields);
  },

  /* Listen PostsActions
   ===============================*/
  setPosts: function(postsArray) {
    var postsLength = postsArray.length;
    for (var i = 0; i < postsLength; i++) {
      this._posts = this._posts.set(postsArray[i].id,postsArray[i]);
    }
  },

  set: function(post) {
    this._posts = this._posts.set(post.id, post);
    this.trigger(this._posts.get(post.id).toJS());
  },

  onGetPostsCompleted: function(response) {
    this.setPosts(response.body.results);
    PostsActions.thenGetPostsCompleted(response);
  }

});

module.exports = PostStore;

