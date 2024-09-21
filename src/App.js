import React, { useState, useEffect } from 'react';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import './App.css';  // Importing the CSS

function Dashboard() {
  const [eventType, setEventType] = useState('approvals'); // Track which event to show
  const [eventData, setEventData] = useState([]);

  const QueryURL = "https://api.studio.thegraph.com/query/88578/aavesubgraph/version/latest";

  const client = new ApolloClient({
    uri: QueryURL,
    cache: new InMemoryCache()
  });

  // Define GraphQL queries for each event type
  const GET_APPROVALS = gql`
    {
      approvals(first: 16) {
        id
        owner
        spender
        value
      }
    }
  `;

  const GET_BALANCE_TRANSFERS = gql`
    {
      balanceTransfers(first: 16) {
        id
        from
        to
        value
      }
    }
  `;

  const GET_MINTS = gql`
    {
      mints(first: 16) {
        id
        to
        value
      }
    }
  `;

  const GET_BURNS = gql`
    {
      burns(first: 16) {
        id
        from
        value
      }
    }
  `;

  // Fetch data based on selected event type
  useEffect(() => {
    const fetchData = async () => {
      try {
        let query;
        if (eventType === 'approvals') {
          query = GET_APPROVALS;
        } else if (eventType === 'balanceTransfers') {
          query = GET_BALANCE_TRANSFERS;
        } else if (eventType === 'mints') {
          query = GET_MINTS;
        } else if (eventType === 'burns') {
          query = GET_BURNS;
        }

        const { data } = await client.query({ query });
        setEventData(data[eventType]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [eventType, client, GET_APPROVALS, GET_BALANCE_TRANSFERS, GET_MINTS, GET_BURNS]);

  return (
    <div  className = 'parent'>
      <div className="banner">
        <h1>Aave Token Event Dashboard</h1>
        <p>Aave is a decentralized finance protocol that allows users to lend and borrow cryptocurrencies.</p>
        <p>Explore Aave token events like Approvals, Balance Transfers, Mints, and Burns.</p>
        
      </div>

      <nav>        
        <button onClick={() => setEventType('approvals')}>Approvals</button>
        <button onClick={() => setEventType('balanceTransfers')}>Balance Transfers</button>       
        <button onClick={() => setEventType('mints')}>Mints</button>
        <button onClick={() => setEventType('burns')}>Burns</button>
      </nav>

      {/* content body */}

      <div className= 'card'>
      
        <h2 >{eventType.charAt(0).toUpperCase() + eventType.slice(1)} Data</h2>
        <div className="content">
        {eventData && eventData.length > 0 ? (
          eventData.map((event) => (
            <div key={event.id} >
              {eventType === 'approvals' && (
                <div className ='card-data'>
                 
                  <div>Owner: {event.owner}</div>
                  <div>Spender: {event.spender}</div>
                  <div>Value: {event.value}</div>


                
                </div>
              )}
              {eventType === 'balanceTransfers' && (
                <div className='card-data'>
                  <div>From: {event.from}</div>
                  <div>To: {event.to}</div>
                  <div>Value: {event.value}</div>
                </div>
              )}
              {eventType === 'mints' && (
                <div className='card-data'>
                  <div>To: {event.to}</div>
                  <div>Value: {event.value}</div>
                </div>
              )}
              {eventType === 'burns' && (
                <div className='card-data'>
                  <div>From: {event.from}</div>
                  <div>Value: {event.value}</div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No data available for {eventType}</p>
        )}
        </div>
      </div>

      </div>
    
  );
}

export default Dashboard;
