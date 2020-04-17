import React from 'react'

const StocksLoaderStatus = props => {
  if(props.connectionError) {
    return (
      <div className='is-medium' style={{background: "white", padding: "20px", border: "2px solid black"}}>
        <span className='has-text-danger' >Server sent no data. Probably the market is closed at the moment. </span>
        <br />(Come back later :-))
      </div>
    );
  } else {
    return (
      <div className='tag is-large is-success'>
        <span className='loader'/>
      </div>
    );
  }
}

export default StocksLoaderStatus;
