import style from './index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';


// const API_URL = "https://api.cryptonator.com/api/ticker/";
const API_URL = "http://localhost:3000/pairs/";

const UPDATE_INTERVAL = 10000;

const pairs = [
  {"name":"Bitcoin","id":"btc-usd"},
  {"name":"Ether","id":"eth-usd"},
  {"name":"Litecoin","id":"ltc-usd"},
  {"name":"Monero","id":"xmr-usd"},
  {"name":"Ripple","id":"xrp-usd"},
  {"name":"Dogecoin","id":"doge-usd"},
  {"name":"Dash","id":"dash-usd"},
  {"name":"MaidSafeeCoin","id":"maid-usd"},
  {"name":"Lisk","id":"lsk-usd"},
  {"name":"Storjcoin X","id":"sjcx-usd"}
]

//For Testing
const test_data = [
    {"name":"Bitcoin","base":"BTC","target":"USD","price":"8477.42028862","volume":"92916.88297066","change":"44.09777279"},
    {"name":"Ether","base":"ETH","target":"USD","price":"876.51060450","volume":"310480.13154134","change":"14.15302330"},
    {"name":"Litecoin","base":"LTC","target":"USD","price":"152.39716697","volume":"1031874.98751268","change":"1.12432456"},
    {"name":"Monero","base":"XMR","target":"USD","price":"221.12713565","volume":"52618.16494258","change":"2.10359105"},
    {"name":"Ripple","base":"XRP","target":"USD","price":"0.83239443","volume":"190525567.50193000","change":"0.01127935"},
    {"name":"Dogecoin","base":"DOGE","target":"USD","price":"0.00446731","volume":"169185147.28885001","change":"0.00003487"},
    {"name":"Dash","base":"DASH","target":"USD","price":"555.20835131","volume":"21771.57603766","change":"4.67114421"},
    {"name":"MaidSafeeCoin","base":"MAID","target":"USD","price":"0.38887560","volume":"","change":"0.00273993"},
    {"name":"Lisk","base":"LSK","target":"USD","price":"20.17610000","volume":"1511.00000000","change":"0.00000000"},
    {"name":"Storjcoin X","base":"","target":"","price":"","volume":"","change":""}
];

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
    var results = [];
    var _this = this;
    pairs.map(function(pair, i){
      axios.get(API_URL+pair.id, {
          responseType: 'json'
      }).then(response => {
        //Used for directly call api in react UI
        // if(response.data.success){
        //   var ticker = response.data.ticker;
        //   ticker.name = pair.name;
        //   results.push(ticker);
        // }else{
        //   var ticker = {"base":"-","target":"-","price":"-","volume":"-","change":"-"};
        //   ticker.name = pair.name;
        //   results.push(ticker);
        // }
        var result = response.data;
        result.name = pair.name;
        results.push(response.data);
        if(i == (pairs.length - 1)){
          _this.setState({boxes: results});
          ReactDOM.render(<Timer />, document.getElementById('update-time'));
        }
      });

      //For fake testing
      // results.push(test_data[i]);
      // if(i == (pairs.length - 1)){
      //   _this.setState({boxes: results});
      // }
    })
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