// @flow

import {connect} from 'react-redux'

import RenameWalletButtons, {type StateProps, type DispatchProps} from './RenameWalletButtons.ui'
import type {State, Dispatch, GetState} from '../../../../../ReduxTypes'
import * as Constants from '../../../../../../constants/indexConstants.js'
import {
  CLOSE_MODAL_VALUE,
  START_MODAL_VALUE,
  SUCCESS_MODAL_VALUE,
  wrap
} from '../WalletOptions/action'

import * as WALLET_API from '../../../../../Core/Wallets/api.js'
import * as UI_ACTIONS from '../../../../Wallets/action.js'
import * as CORE_SELECTORS from '../../../../../Core/selectors.js'

const renameWallet = (walletId: string, walletName: string) => (dispatch: Dispatch, getState: GetState) => {
  const state = getState()
  const wallet = CORE_SELECTORS.getWallet(state, walletId)

  dispatch(wrap(START_MODAL_VALUE(Constants.RENAME_VALUE), {walletId}))

  WALLET_API.renameWalletRequest(wallet, walletName)
    .then(() => {
      dispatch(wrap(SUCCESS_MODAL_VALUE(Constants.RENAME_VALUE), {walletId}))
      dispatch(UI_ACTIONS.refreshWallet(walletId))
    })
    .catch((e) => console.log(e))
}

const mapStateToProps = (state: State): StateProps => ({
  walletId: state.ui.scenes.walletList.walletId,
  renameWalletInput: state.ui.scenes.walletList.renameWalletInput,
  walletName: state.ui.scenes.walletList.walletName
})

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
  onNegative: () => {},
  onPositive: (walletId: string, walletName: string) => dispatch(renameWallet(walletId, walletName)),
  onDone: () => dispatch({ type: CLOSE_MODAL_VALUE(Constants.WALLET_OPTIONS.RENAME.value) })
})

export default connect(mapStateToProps, mapDispatchToProps)(RenameWalletButtons)
