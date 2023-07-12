import {
    FETCH_ALL,
    ADD_NEW,
    UPDATE,
    DELETE,
    START_LOADING,
    END_LOADING,
    GET_TRANSACTION
} from '../actions/constants'

const transactions = (state = {isLoading: true, transactions: []}, action) => {
    console.log(action);
    switch (action.type) {
        case START_LOADING:
            return {...state, isLoading: true};
        case END_LOADING:
            return {...state, isLoading: false};
        case FETCH_ALL:
            return {
                ...state,
                transactions: action.payload.data,
                currentPage: action.payload.currentPage,
                numberOfPages: action.payload.numberOfPages,
            };
        case GET_TRANSACTION:
            return {...state, transactions: action.payload};
        case ADD_NEW:
            return {...state, transactions: [...state.transactions, action.payload]};
        case UPDATE:
            return {
                ...state,
                transactions: state.transactions.map((transaction) => (transactions._id === action.payload._id ? action.payload : transaction))
            };
        case DELETE:
            return {
                ...state,
                transactions: state.transactions.filter((transaction) => transactions._id !== action.payload)
            };
        default:
            return state;
    }
};

export default transactions


//   const invoices =( state = { invoices: [], }, action ) => {
//     switch (action.type) {
//         case FETCH_ALL:
//             return { ...state, invoices: action.payload }

//         case GET_INVOICE:
//             return { ...state, invoice: action.payload }

//         case ADD_NEW:
//             return { ...state, invoices: [...state.invoices, action.payload] }

//         case UPDATE:
//             return { ...state, invoices: state.invoices.map((invoice) => invoice._id === action.payload ? action.payload : invoice) }

//         case DELETE: 
//         return {...state, invoices: state.invoices.filter((invoice) => invoice._id !== action.payload)}

//         default:
//             return state;
//     }
// }

// export default invoices
