
import ReactDOM from "react-dom/client";
import App from "./App";
import {  ApolloClient,  InMemoryCache,  ApolloProvider,} from "@apollo/client";
import "./assets/pages/dashboard.css";
const client = new ApolloClient({
 uri: "http://localhost:4000/graphql", cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
