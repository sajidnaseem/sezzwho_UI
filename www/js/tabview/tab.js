import React from 'react';
import ReactDOM from 'react-dom'
import Layout from './Layout'

var tabview ={
	
    init: function(){	
     const app= document.getElementById("react-tab-result"); 
	 ReactDom.render(<Layout/>, app);  	
	}
}
sezzwhoApp.tabview = tabview;
