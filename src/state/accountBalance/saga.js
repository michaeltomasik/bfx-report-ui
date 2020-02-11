import {
  call,
  put,
  select,
  takeLatest,
} from 'redux-saga/effects'

import { makeFetchCall } from 'state/utils'
import { updateErrorStatus } from 'state/status/actions'
import { frameworkCheck } from 'state/ui/saga'

import types from './constants'
import actions from './actions'
import selectors from './selectors'

export const getReqBalance = params => makeFetchCall('getBalanceHistory', params)

/* eslint-disable-next-line consistent-return */
export function* fetchAccountBalance() {
  try {
    const shouldProceed = yield call(frameworkCheck)
    if (!shouldProceed) {
      // stop loading for first request
      return yield put(actions.updateBalance([]))
    }

    const params = yield select(selectors.getParams)

    const { result = [], error } = yield call(getReqBalance, params)
    yield put(actions.updateBalance(result))

    if (error) {
      yield put(actions.fetchFail({
        id: 'status.fail',
        topic: 'accountbalance.title',
        detail: JSON.stringify(error),
      }))
    }
  } catch (fail) {
    yield put(actions.fetchFail({
      id: 'status.request.error',
      topic: 'accountbalance.title',
      detail: JSON.stringify(fail),
    }))
  }
}

function* refreshAccountBalance() {
  const params = yield select(selectors.getParams)
  yield put(actions.fetchBalance(params))
}

function* fetchAccountBalanceFail({ payload }) {
  yield put(updateErrorStatus(payload))
}

export default function* accountBalanceSaga() {
  yield takeLatest(types.FETCH_BALANCE, fetchAccountBalance)
  yield takeLatest(types.REFRESH, refreshAccountBalance)
  yield takeLatest(types.FETCH_FAIL, fetchAccountBalanceFail)
}
