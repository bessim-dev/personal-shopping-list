import React from "react";

export const ItemsContext = React.createContext();
const initialState = {
  loading: true,
  error: "",
  items: [],
};
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
async function postData(dataSource, content) {
  try {
    const data = await fetch(dataSource, {
      method: "POST",
      body: JSON.stringify(content),
    });
    const dataJSON = await data.json();
    if (dataJSON) {
      return await { data: dataJSON, error: false };
    }
  } catch (error) {
    return { data: false, error: error.message };
  }
}
const Reducer = (state, action) => {
  switch (action.type) {
    case "GET_ITEM_SUCCESS":
      return {
        ...state,
        items: action.payload,
        loading: false,
      };
    case "GET_ITEM_FAILURE":
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case "ADD_ITEM_SUCCESS":
      return {
        ...state,
        items: [...state.items, action.payload],
        loading: false,
      };
    case "ADD_ITEM_FAILURE":
      return {
        ...state,
        loading: false,
        error: "something went wrong ..",
      };
    default:
      break;
  }
};
const ItemsContextProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(Reducer, initialState);
  const getItemsRequest = async (id) => {
    const result = await fetchData(`https://my-json-server.typicode.com/PacktPublishing/React-Projects/
        items/${id}/items`);
    if (result.data && result.data.length) {
      dispatch({ type: "GET_ITEM_SUCCESS", payload: result.data });
    } else {
      dispatch({ type: "GET_ITEM_FAILURE", payload: result.error });
    }
  };
  const addItemRequest = async (content) => {
    const result = await postData(
      "https://my-json-server.typicode.com/PacktPublishing/React-Projects/items",
      content
    );
    if(result.data && result.data.hasOwnProperty('id')){
      dispatch({type:'ADD_ITEM_SUCCESS', payload: content})
    }else{
      dispatch({type:'ADD_ITEM_FAILURE'})
    }
  };
  return (
    <ItemsContext.Provider value={{ ...state, getItemsRequest, addItemRequest}}>
      {children}
    </ItemsContext.Provider>
  );
};
export default ItemsContextProvider;
