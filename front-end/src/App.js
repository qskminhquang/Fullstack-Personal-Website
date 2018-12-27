import React, { Component } from 'react';
import { Link, DirectLink, Element , Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'
import './App.css';

class App extends Component {
  // Initialize state
  state = { privatePem: null, publicPem: null, isLoading: false };
  // Fetch RSAKey after first mount
  componentDidMount() {
	document.title = 'Simple Cryptography | qskminhquang.tk';
	this.createRSAKey();
  }

  createRSAKey() {
	this.setState({isLoading: true});
	this.getRSAKey();
  }
  
  // Get the RSAKey and store them in state
  getRSAKey() {
    fetch('/api/create-rsa-key')
      .then(res => res.json())
      .then(data => this.setState({
		privatePem: data.privatePem,
		publicPem: data.publicPem,
		isLoading: false
	  }));
  }
  
  scrollToTop(e) {
	e.preventDefault();
    scroll.scrollToTop({
      duration: 800,
      delay: 0,
      smooth: 'easeInOutQuart'
    });
  }

  // document.getElementById("sec01").offsetTop;
  scrollTo(e, offset) {
	e.preventDefault();
    scroll.scrollTo(offset - 70, {
      duration: 800,
      delay: 0,
      smooth: 'easeInOutQuart'
    });
  }

  render() {
    const {privatePem, publicPem, isLoading} = this.state;
		var buttonValue = "Create RSA Key";
		if (isLoading) buttonValue = "  Loading...  ";
    return (
		<div className="App">
			{/* Header & Navigation */}
			<header className="my-header">
				<div className="row">
					<a className="logo" href="#top"
						onClick={this.scrollToTop}>
						428/512</a>
					<div className="my-nav">
						<ul>
							<li><a href="#section01"
								onClick={(e) => this.scrollTo(e, 600)}>
								Create RSA Key</a></li>
							<li><a href="#section02"
								onClick={(e) => this.scrollTo(e, 0 + 1271)}>
								Key Exchange</a></li>
							<li><a href="#section03"
								onClick={(e) => this.scrollTo(e, 0 + 1833)}>
								Sign/Verify</a></li>
							<li><a href="#section04"
								onClick={(e) => this.scrollTo(e, 0 + 2395)}>
								AES Encryption</a></li>
						</ul>
					</div>
				</div>
			</header>
			{/* Banner */}
			<div className="banner">
				<h1><span>Simple</span><br />Cryptography</h1>
				<p>Đồ án được thực hiện bởi nhóm hai thành viên Nguyễn Minh Quang - 1412428 và Phạm Văn Thế - 1412512. Sử dụng NodeJs là ngôn ngữ lập trình chính.</p>
				<div className="mouse">
					<span></span>
				</div>
			</div>
			{/* List Section */}
			<div className="row content">
				{/* Section 01: ???*/}
				<h1 id="section01">Khởi tạo khóa RSA</h1>
				<p>Cặp khóa khởi tạo bằng module <a href="https://www.npmjs.com/package/node-rsa">node-rsa</a>, có độ dài 2048-bits và được hiển thị dưới định dạng PEM-Base64 với tiêu chuẩn PKCS#1 cho khóa Private và PKCS#8 cho khóa Public.</p>
				<div className="code-area">
					<input type="button" disabled={isLoading}
						className="button" value={buttonValue}
						onClick={this.createRSAKey.bind(this)}/>
					<h2>Private Key</h2>
					<p>{privatePem}</p>
					<h2>Public Key</h2>
					<p>{publicPem}</p>
				</div>
				{/* Section 02: ???*/}
				<h1 id="section02">Section 02</h1>
				<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
				{/* Section 03: ???*/}
				<h1 id="section03">Section 03</h1>
				<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
				{/* Section 04: ???*/}
				<h1 id="section04">Section 04</h1>
				<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
				{/* Section 05: ???*/}
			</div>
		</div>
    );
  }
}

export default App;