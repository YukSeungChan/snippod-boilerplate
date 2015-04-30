'use strict';

var React = require('react'),
    { PropTypes } = React,
    Reflux = require('reflux'),
    PureRenderMixin = require('react/addons').addons.PureRenderMixin,
    cx = require('classnames'),
    //components
    Spinner = require('../../commons/Spinner.jsx'),
    //store
    ComponentMessageStore = require('../../../stores/subs/ComponentMessageStore'),
    //actions
    PostsActions = require('../../../actions/posts/PostsActions'),
    UIActions = require('../../../actions/commons/UIActions');


var ComposerBox = React.createClass({

  mixins: [
    PureRenderMixin,
    Reflux.listenTo(PostsActions.thenSubmitPostCompleted, 'resetForm'),
    Reflux.listenTo(ComponentMessageStore, 'onErrorMessage')
  ],

  propTypes: {
    params: PropTypes.object.isRequired,
    query: PropTypes.object.isRequired,
    account: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired
  },

  getInitialState: function() {
    return {
      submitted: false
    };
  },

  resetForm: function() {
    this.refs.title.getDOMNode().value = '';
    this.refs.link.getDOMNode().value = '';
    this.refs.submit.getDOMNode().disabled = false;
    this.setState({
      submitted: false
    });
  },

  onErrorMessage: function(errorMessage) {
    this.refs.submit.getDOMNode().disabled = false;
    var errorSentence;
    if (typeof errorMessage.info !== 'undefined') {
      errorSentence = errorMessage.info[0].msg;
    } else {
      errorSentence = null;
    }
    this.setState({
      error: errorSentence,
      submitted: false
    });
  },

  submitPost: function(e) {
    e.preventDefault();
    var form = e.currentTarget;
    var auth = this.props.auth;
    var titleEl = this.refs.title.getDOMNode();
    var linkEl = this.refs.link.getDOMNode();

    if (!auth.loggedIn) {
      UIActions.showOverlay('login');
      return;
    }

    if (titleEl.value.trim() === '') {
      this.setState({
        'postError': 'title_error'
      });
      return;
    }

    if (linkEl.value.trim() === '') {
      this.setState({
        'postError': 'link_error'
      });
      return;
    }

    this.refs.submit.getDOMNode().disabled = true;
    this.setState({
      submitted: true
    });

    PostsActions.submitPost(form);

  },



  render: function() {

    var postError = this.state.postError;

    var titleInputCx = cx({
      'panel-input': true,
      'input-error': postError === 'title_error'
    });

    var linkInputCx = cx({
      'panel-input': true,
      'input-error': postError === 'link_error'
    });

    var error = null;
    if (this.state.error) {
      error = (
        /* jshint ignore:start */
        <div className="error">
          { this.state.error }
        </div>
        /* jshint ignore:end */
      );
    }

    return (
      /* jshint ignore:start */
      <div id="composer-box" className="composer-box">
        <div id="header-panel" className="header-panel text-center">
          <form method="post" action="/posts" onSubmit={ this.submitPost } className="panel-form">
            <input type="text" name="title" className={ titleInputCx } placeholder="Title" ref="title" id="title"/>
            <input type="url" name="url" className={ linkInputCx } placeholder="Link" ref="link" id="url"/>
            <button type="submit" className="button panel-button button-outline" ref="submit">
              { this.state.submitted ? <Spinner /> : 'Submit' }
            </button>
          </form>
        </div>
        { error }
      </div>
      /* jshint ignore:end */

    );
  }

});

module.exports = ComposerBox;
