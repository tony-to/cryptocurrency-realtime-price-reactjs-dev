import style from './index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

const API_URL = "http://localhost:3000";

const UPDATE_INTERVAL = 10000;


class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    return (
        <h1>Cryptocurrency Realtime Price</h1>
    );
  }
}

ReactDOM.render(<Header />, document.getElementById('header'));

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      boxes:[{
            "name":"",
            "base":"",
            "target":"",
            "price":"",
            "volume":"",
            "change":""
          }]
    };
  }

  componentDidMount () {
    var _this = this;
    axios.get(API_URL+"/pairs", {
        responseType: 'json'
    }).then(response => {
      var results = response.data;
      _this.setState({boxes: results});
      ReactDOM.render(<Timer />, document.getElementById('update-time'));
    });
  }


  render() {
    console.log("Update pairs info");
    console.log(this.state.boxes);

    if (this.state.boxes) {
      return (
          <div className={"currency-boxes row"}> 
            {

              this.state.boxes.map(function (box,i) {
                var volume_class = "change-value positive";
                if(parseFloat(box.change) < 0){
                  volume_class = "change-value negative";
                }
                return  <div className={"col-xs-12 col-sm-6 col-md-4"} key={i}>
                          <div className={"currency-box"}>
                            <div className={"box-name"}>{box.name}</div>
                            <div className={"box-price"}>${box.price}</div>
                            <div className={"box-detail row"}>
                              <div className={"box-volumne col-xs-6 col-md-6"}>
                                <div className={"volumne-label"}>volume:</div>
                                <div className={"volumne-value"}>{box.volume}</div>
                              </div>
                              <div className={"box-change col-xs-6 col-md-6"}>
                                <div className={"change-label"}>change:</div>
                                <div className={volume_class}>{box.change}</div>
                              </div>
                            </div>
                          </div>
                        </div>
              })
            }
         </div>
      )
    }
  }
}

ReactDOM.render(<App />, document.getElementById('box-container'));

class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.tick = this.tick.bind(this);
    this.state = {
      curTime: new Date().toLocaleString(),
    }
  }
  tick() {
    ReactDOM.render(<App />, document.getElementById('box-container'));
    this.setState({
      curTime : new Date().toLocaleString()
    })
  }

  componentDidMount() {
      this.interval = setInterval(this.tick, UPDATE_INTERVAL);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
      return (
        <div>Updated time: {this.state.curTime}</div>
      );
  }
}

//For testing
// ReactDOM.render(<Timer />, document.getElementById('update-time'));