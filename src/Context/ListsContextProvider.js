import React from "react";
export const ListsContext = React.createContext();

async function fetchData(dataSource) {
  try {
    const data = await fetch(dataSource);
    const dataJSON = await data.json();
    if (dataJSON) {
      return await { data: dataJSON, error: false };
    }
  } catch (error) {
    return { data: false, error: error.message };
  }
}
const initialState = {
  loading: true,
  error: "",
  lists: [],
  list: {},
};
const reducer = (state, action) => {
  switch (action.type) {
    case "GET_LISTS_SUCCESS":
      return {
        ...state,
        lists: action.payload,
        loading: false,
      };
    case "GET_LISTS_FAILED":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case "GET_LIST_SUCCESS":
      return {
        ...state,
        list: action.payload,
        loading: false,
      };
    case "GET_LIST_FAILED":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      break;
  }
};
const ListsContextProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const getListsRequest = async () => {
    const result = await fetchData(
      "https://my-json-server.typicode.com/PacktPublishing/React-Projects/lists"
    );
    if (result.data && result.data.length) {
      dispatch({ type: "GET_LISTS_SUCCESS", payload: result.data });
    } else {
      dispatch({ type: "GET_LISTS_FAILED", payload: result.error });
    }
  };
  const getListRequest = async (id) => {
    const result = await fetchData(`https://my-json-server.typicode.com/PacktPublishing/React-Projects/lists/${id}`);
    if (result.data && result.data.hasOwnProperty('id')) {
      dispatch({ type: "GET_LIST_SUCCESS", payload: result.data });
    } else {
      dispatch({ type: "GET_LIST_FAILURE", payload: result.error });
    }
  };
  return (
    <ListsContext.Provider
      value={{ ...state, getListsRequest, getListRequest }}
    >
      {children}
    </ListsContext.Provider>
  );
};
export default ListsContextProvider;
