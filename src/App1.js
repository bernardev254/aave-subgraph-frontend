import { useEffect, useState } from 'react';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import './App.css';

function App() {
  // Fix: rename state from transfers to approvals
  const [approvals, setApprovals] = useState([]);

  const QueryURL = "https://api.studio.thegraph.com/query/88578/aavesubgraph/version/latest";

  const client = new ApolloClient({
    uri: QueryURL,
    cache: new InMemoryCache()
  });

  const GET_APPROVALS = gql`
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
  }
  `;

  useEffect(() => {
    console.log("Fetching approvals...");
    const fetchApprovals = async () => {
      try {
        const { data } = await client.query({
          query: GET_APPROVALS
        });
        console.log("Received approvals data:", data);
        setApprovals(data.approvals); // Fix: correctly set approvals
      } catch (error) {
        console.error("Error fetching approvals:", error);
      }
    };

    fetchApprovals();
  }, [client, GET_APPROVALS]); // The client and query can be added to dependencies

  return (
    <div>
      <h1>Approvals Information</h1>
      {/* Check if approvals is not null and has length */}
      {approvals && approvals.length > 0 ? (
        approvals.map((approval) => (
          <div key={approval.id}>
            <div>Sender: {approval.owner}</div>
            <div>Receiver: {approval.spender}</div>
            <div>Amount: {approval.value}</div>
            <br />
          </div>
        ))
      ) : (
        <div>No approvals available.</div>
      )}
    </div>
  );
}

export default App;
