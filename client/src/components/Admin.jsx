import React from 'react'
import ManagementRow from "./ManagementRow";

class Admin extends React.Component  {
  constructor(props) {
      super(props);
      this.state = {
        users: [],
      };
    }

  fetchUsers = () => {
    fetch('https://' + window.location.hostname + '/api/users')
    .then(response => response.json())
    .then(users => this.setState({users: users}));
  };

  componentDidMount() {
    this.fetchUsers()
  }

  render() {
    return (
        <div>
          <div className='card-header'>
            <div className='card-header-title'>
              Users
            </div>
          </div>
            <div className='card-content'>
              {
                this.state.users.length !== 0 ?
                    <table className='table is-bordered' style={{width: "100%"}}>
                      <thead>
                      <tr>
                        <th>Name</th>
                        <th>Surname</th>
                        <th>Email</th>
                        <th>Money</th>
                      </tr>
                      </thead>
                      <tbody>
                      {
                        this.state.users.map(user => {
                          return (
                              <tr>
                                <td>{user.name}</td>
                                <td>
                                  {user.surname}
                                </td>
                                <td>
                                    {user.email}
                                </td>
                                <td>
                                    {user.money}
                                </td>
                              </tr>
                          )
                        })
                      }
                      </tbody>
                    </table>
                    :
                      <p style={{textAlign: "center"}} >No users available</p>
              }
            </div>
        </div>
    );
  }
}

export default Admin;
