import { combineReducers } from 'redux'

import transactions from './transactions'
import invoices from './invoices'
import clients from './clients'
import auth from './auth'
import profiles from './profiles'

export default combineReducers({ invoices, clients, auth, profiles, transactions })