import React from 'react'
import ReactDOM from 'react-dom'


var ArticlesView = React.createClass({
	componentWillMount: function() {

		// 3 context fixes

		// // stable version of "this"
		// var thisComponent = this
		// this.props.articleColl.on('sync',function() {
		// 	thisComponent.setState({
		// 		coll: thisComponent.props.articleColl
		// 	})
		// })

		// // .bind(contextObj), which returns a new function with no 
		// // "this" context, using the input object to replace "this"
		// this.props.articleColl.on('sync',function() {
		// 	this.setState({
		// 		coll: this.props.articleColl
		// 	})
		// }.bind(this))

		// fat-arrow function. fat-arrow functions are nice to use 
		// as callbacks because they have no "this" context
		this.props.articleColl.on('sync',() => {
			this.setState({
				coll: this.props.articleColl
			})
		})
	},

	getInitialState: function() {
		return {
			coll: this.props.articleColl
		}
	},

	render: function() {
		var jackpot = 500
		return (
			<div className="articlesView">
				<Header />
				<NewsContainer articleColl={this.state.coll} />
			</div>
			)
	} 
})

var Header = React.createClass({


	render: function() {
		return (
			<div className="headerContainer">
				<h1>This Just In</h1>
				<input />
			</div>
			)
	}
})

var NewsContainer = React.createClass({

	_getJsxArray: function(articlesArray) {
		// articlesArray.forEach(function())
		var jsxArray = []

		articlesArray.forEach(function(model){
			jsxArray.push(<Article articleModel={model} />)
		})
		// for (var i = 0; i < articlesArray.length; i ++) {
		// 	var model = articlesArray[i]
		// 	// push onto my jsxArray an Article component that has this 
		// 	// model on its props
		// 	jsxArray.push(<Article articleModel={model} />)

		// }



		return jsxArray
	},

	render: function() {
		var imgStyle = {
			display: 'block'
		}
		if (this.props.articleColl.models.length > 0) {
			imgStyle.display = 'none'
		}
		return (
			<div className="newsContainer">
				<img style={imgStyle} src="http://www.owlhatworld.com/wp-content/uploads/2015/12/38.gif" />
				{this._getJsxArray(this.props.articleColl.models)}
			</div>
		)
	}
})

var Article = React.createClass({

	_toggleParagraph: function() {
		if(this.state.pDisplay === 'none'){ 
			this.setState({
				pDisplay: 'block',
				buttonState: '-'
			})
		}
		else{
			this.setState({
				pDisplay: 'none',
				buttonState: '+'
			})
		}	
	},

	_goToDetailView: function() {
		location.hash = `detail/${this.props.articleModel.get('_id')}`
	},

	getInitialState: function() {
		// return the object that will be the component's initial state
		return {
			pDisplay: 'none',
			buttonState: '+'
		}
	},

	render: function() {
		console.log(this)
		var styleObj = {
			display: this.state.pDisplay
		}

		return (
			<div className="articleContainer">
				<h2>{this.props.articleModel.get('headline').main}</h2>
				<button onClick={this._goToDetailView} >full page</button>
				{/* the tag below does the same thing, but more simply
				<a href={`#detail/${this.props.articleModel.get('_id')}`}>full page</a>
				*/}
				<p style={styleObj} >{this.props.articleModel.get('lead_paragraph')}</p>
				<button onClick={this._toggleParagraph} className="expand">{this.state.buttonState}</button>
			</div>
			)
	}
})

export default ArticlesView