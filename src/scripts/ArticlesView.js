import React from 'react'				// Loading in the framework for React
import ReactDOM from 'react-dom'		// Loading in the React DOM 


var ArticlesView = React.createClass({		// creating a React component to hold the articles
	componentWillMount: function() {		// Life cycle method for calling on the articles
											// views component 

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
		this.props.articleColl.on('sync',() => {		/* the data we get back from fetch method
															from the collection once it succeeds
															it will broadcase a sync event, which 
															will trigger the set state event */ 

														/* when the collection is populated with data, 
														it will fire a sync event. we attach a callback
														to that sync event. our callback will invoke the 
														setState method on the collection, resetting the 
														"coll" property, which holds the now data-loaded
														collection. */ 
			this.setState({								 
				coll: this.props.articleColl			/* setState causes the component and its children
															to rerender */
			})
		})
	},

	getInitialState: function() {						 /* when the component first mounts this function returns
															the object that will go on the component's state property */
		return {										
			coll: this.props.articleColl				/* we put the collection on the state so that we can update state
															and re-render the app when the collection populates */
		}
	},

	render: function() {							
		// This is all one super stuffed JSX <div> element 
			//VVVVVVVVVVVVVVVVVVVVVV
		return (
			<div className="articlesView">
				<Header />					{/* passing the collection, which lives on state,
											to the NewsContainer's props object, under the property name
											articleColl */}
				<NewsContainer articleColl={this.state.coll} />
			</div>
			)
	} 
})

var Header = React.createClass({		// the actual header component to be rendered in the
										// larger component above containing sites title and 
										// the input bar

	render: function() {
		return (
			<div className="headerContainer">
				<h1>This Just In</h1>
				<input />
			</div>
			)
	}
})

var NewsContainer = React.createClass({				//this is where the articles are being
													// rendered with article data being passed
													// through by the Article Collection in Backbone
													//article models

	_getJsxArray: function(articlesArray) {
		// articlesArray.forEach(function())
		var jsxArray = []							// start with an empty array so that we can push 
													// article models from the article components 

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

	render: function() {							/*  */
		var imgStyle = {
			display: 'block'
		}
		if (this.props.articleColl.models.length > 0) {
			imgStyle.display = 'none'
		}
		return (
			<div className="newsContainer">
				<img style={imgStyle} src="http://www.owlhatworld.com/wp-content/uploads/2015/12/38.gif" />
				{this._getJsxArray(this.props.articleColl.models)} {/* this function returns an array of 
																		Article components, each of which
																		has a articleModel on its props */}
			</div>
		)
	}
})

var Article = React.createClass({				/* creating the React component to handle
													the data for an individual article */

	_toggleParagraph: function() {				/* checks the current state to see if the <p> is showing */
		if(this.state.pDisplay === 'none'){ 	// if it is not…
			this.setState({						// we set the state so that the paragraph is showing which
												// causes the component to re-render assigning a different
												// style proper to the paragraph
				pDisplay: 'block',
				buttonState: '-'
			})
		}
		else{
			this.setState({					// and vice versa 
				pDisplay: 'none',
				buttonState: '+'
			})
		}	
	},

	_goToDetailView: function() {  // changing the hash which will fire off the Backbone Router
		location.hash = `detail/${this.props.articleModel.get('_id')}` //read the ID off the Backbone Model that lives
	},																	// on props

	getInitialState: function() {	//the initial state for the buttons and p tags
		// return the object that will be the component's initial state
		return {
			pDisplay: 'none',
			buttonState: '+'
		}
	},

	render: function() {			
		console.log(this)
		var styleObj = {		//a kind of state based obj for better readability and avoiding nested
								// brackets in our render return
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

export default ArticlesView // we export a variable name declared in the file so that it can be imported elswhere
							// since ArticlesView is the top level component and it renders everything else
							// it is the only name we need to export 