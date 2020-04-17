import React from 'react'
import { Sparklines, SparklinesLine } from 'react-sparklines';
import TimeAgo from 'react-timeago'

class ManagementRow extends React.Component {

  sellStock = (stock) => {
      let user = this.props.user;
      user.money = parseFloat(user.money) + parseFloat(this.props.stocks[this.props.selectedStockName].current_value);

      fetch('http://localhost:8000/api/users/' + this.props.user.id, {
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

      fetch('http://localhost:8000/api/stocks/' + stock.id, {
        method: 'DELETE',
      }).then(function(response) {
        return response.json();
      }).then(this.props.fetchOwnedStock);
  };

  render() {
    return (
      <tr>
        <td>{this.props.stock.name.toUpperCase()}</td>
        <td>
          {this.props.stock.price}
        </td>
        <td>
            {this.props.stock.bought_at}
        </td>
        <td>
            <button onClick={() => this.sellStock(this.props.stock)}>Sell</button>
        </td>
      </tr>
    );
  }
}

export default ManagementRow;
