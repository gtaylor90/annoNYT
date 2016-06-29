import React from 'react'
import ReactDOM from 'react-dom'

var DetailView = React.createClass({

	render: function() {
		console.log(this.props.notKey.attributes)
		return (
			<div className="detailView">
				<h1> WELCOME TO DETAIL VIEWH1J!H!! </h1>
				<p> {this.props.notKey.get('snippet')} </p>
			</div>
			)
	}
})






export default DetailView