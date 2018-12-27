import React, { Component } from 'react';
import { Link, DirectLink, Element , Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'
import './App.css';

class App extends Component {
  // Initialize state
  state = {
	privatePem: null,
	publicPem: null,
	isLoadingKey: false,
	RSACipherText: null,
	isRSAEncrypting: false
	};
  // Fetch RSAKey after first mount
  componentDidMount() {
	document.title = 'Simple Cryptography | qskminhquang.tk';
	this.getRSAKey();
  }

  scrollToTop(e) {
	e.preventDefault();
    scroll.scrollToTop({
      duration: 800,
      delay: 0,
      smooth: 'easeInOutQuart'
    });
  }

  // document.getElementById("section03").offsetTop;
  scrollTo(e, offset) {
	e.preventDefault();
    scroll.scrollTo(offset - 70, {
      duration: 800,
      delay: 0,
      smooth: 'easeInOutQuart'
    });
  }
  
  // Get the RSAKey and store them in state
  getRSAKey() {
	this.setState({isLoadingKey: true});
    fetch('/api/create-rsa-key')
      .then(res => res.json())
      .then(data => this.setState({
		privatePem: data.privatePem,
		publicPem: data.publicPem,
		isLoadingKey: false
	  }));
  }
  
  // Send Key, Plain-text and get the Cipher-text and store in state
  RSAEncryption(e) {
	this.setState({isRSAEncrypting: true});
    e.preventDefault();
    const data = new FormData(e.target);
    fetch('/api/rsa-encryption', {
      method: 'POST',
      body: data,
    }).then(res => res.json())
	.then(data => this.setState({
		RSACipherText: data.RSACipherText,
		isRSAEncrypting: false
	}));
  }

  render() {
    const {privatePem, publicPem, isLoadingKey} = this.state;
		var buttonValue = "Create RSA Key";
		if (isLoadingKey) buttonValue = "  Loading...  ";
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
								onClick={(e) => this.scrollTo(e, 600 + 1414 - 110)}>
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
				{/* Section 01: Create RSA Key */}
				<h1 id="section01">Khởi tạo khóa</h1>
				<p>Tiến hành việc sinh khóa RSA. Trong đó, cặp khóa khởi tạo bằng module <a href="https://www.npmjs.com/package/node-rsa">node-rsa</a>, có độ dài 2048-bits và được hiển thị dưới định dạng PEM-Base64 với tiêu chuẩn PKCS#1 cho khóa Private và PKCS#8 cho khóa Public.</p>
				<div className="code-area">
					<input type="button" disabled={isLoadingKey}
						className="button" value={buttonValue}
						onClick={this.getRSAKey.bind(this)}/>
					<h2>Private Key</h2>
					<p>{privatePem}</p>
					<h2>Public Key</h2>
					<p>{publicPem}</p>
				</div>
				{/* Section 02: Key Exchange */}
				<h1 id="section02">trao đổi khóa</h1>
				<p>Trong đồ án này nhóm không thực hiện một thuật toán trao đổi khóa chính quy (như Diffie–Hellman,...) mà chỉ thực hiện việc mã hóa một khóa AES cho trước bằng RSA hoặc tiến hành việc giải mã ngược lại để lấy khóa.</p>
				<form onSubmit={this.RSAEncryption.bind(this)}>
					<label htmlFor="username">Enter username</label>
					<input id="username" name="username" type="text" />
					<label htmlFor="email">Enter your email</label>
					<input id="email" name="email" type="email" />
					<label htmlFor="birthdate">Enter your birth date</label>
					<input id="birthdate" name="birthdate" type="text" />
					<button>Send data!</button>
				</form>
				{/* Section 03: Sign/Verify */}
				<h1 id="section03">Ký và xác mimh chữ ký</h1>
				<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
				{/* Section 04: AES Encryption */}
				<h1 id="section04">Mã hóa dữ liệu</h1>
				<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
			</div>
		</div>
    );
  }
}

export default App;