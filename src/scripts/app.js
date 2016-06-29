import React from 'react'
import ReactDOM from 'react-dom'
import Backbone from 'backbone'
import ArticlesView from './ArticlesView'
import DetailView from './DetailView'
	
const app = function() {

	var NewsModel = Backbone.Model.extend({
			url: 'https://api.nytimes.com/svc/search/v2/articlesearch.json',
			_key: '11eaa2ee2ebb78f1cfb25971ad39c74d',
			parse: function(rawJSON){
				return rawJSON.response.docs[0]
			}
		})


	var NewsCollection = Backbone.Collection.extend({
		url: 'https://api.nytimes.com/svc/search/v2/articlesearch.json',
		_key: '11eaa2ee2ebb78f1cfb25971ad39c74d',
		parse: function(rawJSON) {
			return rawJSON.response.docs
		}
	})
	

	var NewsRouter = Backbone.Router.extend({
		routes: {
			"detail/:articleId": "doDetailView",
			"search/:topic": "doArticleSearch",
			"home": "showHomePage",
			"*catchall": "redirect"
		},

		doArticleSearch: function(searchTerm) {
			var searchCollection = new NewsCollection()
			searchCollection.fetch({
				data: {
					"apikey": searchCollection._key,
					q: searchTerm
				}

			})
		},

		doDetailView: function(id) {
			var newsModel = new NewsModel()
			newsModel.fetch({
				data: {
					fq: "_id:" + id,
					"apikey": newsModel._key
				}
			}).then(function(){   /* this is setting up the DetaiView to be rendered after Backbone
									gathers the data for the item being being targetted for detail 
									expainsion. Assigns newsModel to the DetailView.props.notKey. 
									it then mounts it on the dom node passed through as the second 
									argument*/
				ReactDOM.render(<DetailView notKey={newsModel} />, document.querySelector('.container'))

			})
		},

		redirect: function() {
			location.hash = "home"
		},

		showHomePage: function() {
			var homeCollection = new NewsCollection()
			homeCollection.fetch({
				data: {
					apikey: homeCollection._key
				}
			})  //no Then function but will render the data after the Backbone triggers this function
			ReactDOM.render(<ArticlesView articleColl={homeCollection} />, document.querySelector('.container'))				
			// articlesView.props.popop = homeCollection
		},

		initialize: function() {
			Backbone.history.start()
		}
	})

	new NewsRouter()
}

app()