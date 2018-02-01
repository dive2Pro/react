/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule ReactDefaultBatchingStrategy
 */

'use strict';

var ReactUpdates = require('ReactUpdates');
var Transaction = require('Transaction');

var emptyFunction = require('fbjs/lib/emptyFunction');

var RESET_BATCHED_UPDATES = {
  initialize: emptyFunction,
  close: function() {
    ReactDefaultBatchingStrategy.isBatchingUpdates = false;
  },
};

var FLUSH_BATCHED_UPDATES = {
  initialize: emptyFunction,
  /**
   * TODO: 此处会去更新已经 dirty 的 components
   */
  close: ReactUpdates.flushBatchedUpdates.bind(ReactUpdates),
};

/**
 *  每当 transaction 被 perform,
 *  这两个方法都会被执行
 */
var TRANSACTION_WRAPPERS = [FLUSH_BATCHED_UPDATES, RESET_BATCHED_UPDATES];

function ReactDefaultBatchingStrategyTransaction() {
  this.reinitializeTransaction();
}

Object.assign(ReactDefaultBatchingStrategyTransaction.prototype, Transaction, {
  getTransactionWrappers: function() {
    return TRANSACTION_WRAPPERS;
  },
});

var transaction = new ReactDefaultBatchingStrategyTransaction();

var ReactDefaultBatchingStrategy = {
  isBatchingUpdates: false,

  /**
   * Call the provided function in a context within which calls to `setState`
   * and friends are batched such that components aren't updated unnecessarily.
   */
  batchedUpdates: function(callback, a, b, c, d, e) {
    var alreadyBatchingUpdates = ReactDefaultBatchingStrategy.isBatchingUpdates;
    /**
     *  要明确一点的是 此时每一个Component 都有自己的实例 ( 但是更新的策略是相同的 ):
     *         - ReactUpdates
     *         - ReactBatchingStrategy
     *         - ReactTransaction
     *  
     *  
     */
    ReactDefaultBatchingStrategy.isBatchingUpdates = true;

    // The code is written this way to avoid extra allocations
    if (alreadyBatchingUpdates) {
      return callback(a, b, c, d, e);
    } else {
      return transaction.perform(callback, null, a, b, c, d, e);
    }
  },
};

module.exports = ReactDefaultBatchingStrategy;
