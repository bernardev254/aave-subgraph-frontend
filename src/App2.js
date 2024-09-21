import React, { useState, useEffect } from 'react';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import './App.css';

const client = new ApolloClient({
  uri: 'https://api.studio.thegraph.com/query/88578/aavesubgraph/version/latest', // Replace with your subgraph URL
  cache: new InMemoryCache(),
});

const GET_ALL_EVENTS = gql`
  {
    approvals(first: 5) {
      id
      owner
      spender
      value
    }
    balanceTransfers(first: 5) {
      id
      from
      to
      value
    }
    mints(first: 5) {
      id
      amount
      to
    }
    burns(first: 5) {
      id
      amount
      from
    }
    delegateChangeds(first: 5) {
      id
      delegator
      delegatee
    }
  }
`;

function Dashboard() {
  const [selectedEvent, setSelectedEvent] = useState('approvals'); // Default event view
  const [eventData, setEventData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const { data } = await client.query({
          query: GET_ALL_EVENTS,
        });
        setEventData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching events:', error);
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const renderEventData = () => {
    if (loading) return <div>Loading events...</div>;

    switch (selectedEvent) {
      case 'approvals':
        return eventData.approvals?.map((approval) => (
          <div key={approval.id} className="card">
            <p><strong>Owner:</strong> {approval.owner}</p>
            <p><strong>Spender:</strong> {approval.spender}</p>
            <p><strong>Value:</strong> {approval.value}</p>
          </div>
        ));
      case 'transfers':
        return eventData.balanceTransfers?.map((transfer) => (
          <div key={transfer.id} className="card">
            <p><strong>From:</strong> {transfer.from}</p>
            <p><strong>To:</strong> {transfer.to}</p>
            <p><strong>Value:</strong> {transfer.value}</p>
          </div>
        ));
      case 'mints':
        return eventData.mints?.map((mint) => (
          <div key={mint.id} className="card">
            <p><strong>To:</strong> {mint.to}</p>
            <p><strong>Amount:</strong> {mint.amount}</p>
          </div>
        ));
      case 'burns':
        return eventData.burns?.map((burn) => (
          <div key={burn.id} className="card">
            <p><strong>From:</strong> {burn.from}</p>
            <p><strong>Amount:</strong> {burn.amount}</p>
          </div>
        ));
      case 'delegateChanged':
        return eventData.delegateChangeds?.map((delegateChanged) => (
          <div key={delegateChanged.id} className="card">
            <p><strong>Delegator:</strong> {delegateChanged.delegator}</p>
            <p><strong>Delegatee:</strong> {delegateChanged.delegatee}</p>
          </div>
        ));
      default:
        return <div>No event selected</div>;
    }
  };

  return (
    <div className="dashboard-container">
      {/* Aave Banner */}
      <div className="banner">
        <h1>Welcome to Aave Dashboard</h1>
        <p>Aave is a decentralized finance protocol that allows users to lend and borrow cryptocurrencies.</p>
      </div>

      {/* Navigation */}
      <nav>
        <button onClick={() => setSelectedEvent('approvals')}>Approvals</button>
        <button onClick={() => setSelectedEvent('transfers')}>Transfers</button>
        <button onClick={() => setSelectedEvent('mints')}>Mints</button>
        <button onClick={() => setSelectedEvent('burns')}>Burns</button>
        <button onClick={() => setSelectedEvent('delegateChanged')}>Delegate Changed</button>
      </nav>

      {/* Event Data */}
      <div className="dashboard-section">
        {renderEventData()}
      </div>
    </div>
  );
}

export default Dashboard;
