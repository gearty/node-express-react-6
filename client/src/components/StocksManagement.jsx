import React, { useEffect, useState } from 'react';
import {Line} from 'react-chartjs-2';
import * as zoom from 'chartjs-plugin-zoom'
import { chartJsConfig, chartColors, chartDataset } from '../chartConfig.js'
import MarketTrendArrow from "./MarketTrendArrow";
import StockRow from "./StockRow";
import ManagementRow from "./ManagementRow";

class StocksManagement extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        ownedStocks: [],
        user: props.user,
        selectedStockName: props.selectedStockName,
        stocks: props.stocks
      };
    }

  // too big a function?
  updateChart = () => {
    let chart = this.refs.chart.chartInstance;

    if(Object.keys(this.props.stocks).length === 0)
    {
      chart.data.datasets = [];
      return chart.update();
    }

    Object.keys(this.props.stocks).map((stock_name, index) =>
    {
      let current_stock = this.props.stocks[stock_name];
      let chart_dataset = chart.data.datasets.find((dataset) => {
        return dataset.label === stock_name.toUpperCase()
      });

      if(current_stock.is_selected)
      {
        let current_stock = this.props.stocks[stock_name];
        this.fetchOwnedStock(stock_name);

        if(chart_dataset)
        {
          // only update the data, don't create a new dataset for the graph
          chart_dataset.data = this.getStockValues(current_stock);
        }
        else
        {
          // create a new dataset for graph
          if(current_stock)
          {
            chart.data.datasets = chart.data.datasets.concat(
              [
                chartDataset(stock_name, chartColors[index], this.getStockValues(current_stock))
              ]
            )
          }
        }
      }
      else
      {
        if(chart_dataset)
        {
          // remove the dataset from graph
          chart.data.datasets.splice(chart.data.datasets.indexOf(chart_dataset), 1);
        }
      }
      chart.update();
    })
  };

  fetchOwnedStock = (name) => {
    fetch('https://' + window.location.hostname + '/api/stocks?name=' + name + '&user=' + this.state.user.id)
    .then(response => response.json())
    .then(stocks => {
        if (stocks) {
            this.setState({ownedStocks: stocks})
        }
        else {
            alert("Something went wrong")
        }
    });
  };

  fetchUser = () => {
    fetch('https://' + window.location.hostname + '/api/users/' + this.state.user.id)
    .then(response => response.json())
    .then(user => {
        if (user[0]) {
            this.setState({user: user[0]})
        }
        else {
            alert("Something went wrong")
        }
    });
  };

  buyStock = () => {
    let user = this.state.user;

    if (parseFloat(user.money) > parseFloat(this.state.stocks[this.state.selectedStockName].current_value)){
      user.money = parseFloat(user.money) - parseFloat(this.state.stocks[this.state.selectedStockName].current_value);
      fetch('https://' + window.location.hostname + '/api/users/' + user.id, {
        method: 'PUT',
        body: JSON.stringify(user),
        headers: {
            'Content-Type': 'application/json'
        }
      }).then(function(response) {
        return response.json();
      }).then(function(data) {
        console.log(data)
      });

      let body = {
        name: this.state.selectedStockName,
        price: this.state.stocks[this.state.selectedStockName].current_value,
        user: user.id,
        bought_at: new Date().toLocaleString()
      };
      fetch( 'https://' + window.location.hostname + '/api/stocks', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
      }).then(function(response) {
        return response.json();
      }).then(() => this.fetchOwnedStock(this.state.selectedStockName));
      }
    else {
      alert("You don't have enough money")
    }

  };

  componentWillReceiveProps(nextProps) {
  if (nextProps.selectedStockName !== this.state.selectedStockName) {
    this.setState({ selectedStockName: nextProps.selectedStockName });
    this.updateChart()
  }
}

  // returns an array of objects, {t: timestamp, y: value}
  getStockValues = (stock) =>{
    return stock.history.map((history) => {
      return {t: new Date(history.time), y: history.value};
    })
  }

  resetZoom = () => {
    this.refs.chart.chartInstance.resetZoom();
  };

  render() {
    return (
      <div className={'card column'} >
        <div className='card-header'>
          <div className='card-header-title'>
            Graph
          </div>
          <div className='card-header-title' style={{textAlign: "end", display: "block"}}>
            <button className="button is-small" onClick={this.resetZoom}>Reset zoom</button>
          </div>
        </div>
        <div className='card-content'>
          <Line
            data={{datasets: []}}
            options={chartJsConfig}
            ref='chart'
          />
        </div>
        {this.props.selectedStockName !== null ?
        <div>
          <div className='card-header'>
            <div className='card-header-title'>
              {`Balance ${parseFloat(this.state.user.money).toFixed(2)} $`}
            </div>
            <div className='card-header-title' style={{justifyContent: "flex-end"}}>
              <button className="button is-success" onClick={this.buyStock}>Buy</button>
            </div>
          </div>
            <div className='card-content'>
              {
                this.state.ownedStocks.length !== 0 ?
                    <table className='table is-bordered' style={{width: "100%"}}>
                      <thead>
                      <tr>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Bought At</th>
                        <th>Actions</th>
                      </tr>
                      </thead>
                      <tbody>
                      {
                        this.state.ownedStocks.map(stock => {
                          return (
                              <ManagementRow
                                  stock={stock}
                                  user={this.state.user}
                                  selectedStockName={this.state.selectedStockName}
                                  stocks={this.state.stocks}
                                  fetchUser={this.fetchUser}
                                  fetchOwnedStock={() => this.fetchOwnedStock(this.state.selectedStockName)}
                              />
                          )
                        })
                      }
                      </tbody>
                    </table>
                    :
                      <p style={{textAlign: "center"}} >You haven't bought this stock yet</p>
              }
            </div>
          </div>
              :
            <p style={{textAlign: "center"}} >Select a Stock to manage</p>
          }
      </div>
    );
  }
}

export default StocksManagement;
