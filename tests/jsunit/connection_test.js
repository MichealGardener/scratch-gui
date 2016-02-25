/**
 * @license
 * Blockly Tests
 *
 * Copyright 2016 Google Inc.
 * https://developers.google.com/blockly/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Tests for connection logic.
 * @author fenichel@google.com (Rachel Fenichel)
 */
'use strict';

var input;
var output;
var previous;
var next;

var dummyWorkspace;

function connectionTest_setUp() {
  dummyWorkspace = {};
  input = new Blockly.Connection({workspace: dummyWorkspace}, Blockly.INPUT_VALUE);
  output = new Blockly.Connection({workspace: dummyWorkspace}, Blockly.OUTPUT_VALUE);
  previous = new Blockly.Connection({workspace: dummyWorkspace}, Blockly.PREVIOUS_STATEMENT);
  next = new Blockly.Connection({workspace: dummyWorkspace}, Blockly.NEXT_STATEMENT);
}

function connectionTest_tearDown() {
  input = null;
  output = null;
  previous = null;
  next = null;
  dummyWorkspace = null;
}

/**
 * These tests check that the reasons for failures to connect are consistent (internal view of
 * error states).
 */
function testCanConnectWithReason_TargetNull() {
  connectionTest_setUp();

  assertEquals(Blockly.Connection.REASON_TARGET_NULL, input.canConnectWithReason_(null));

  connectionTest_tearDown();
}

function testCanConnectWithReason_Disconnect() {
  connectionTest_setUp();

  var tempConnection = new Blockly.Connection({workspace: dummyWorkspace}, Blockly.OUTPUT_VALUE);
  Blockly.Connection.connectReciprocally(input, tempConnection);
  assertEquals(Blockly.Connection.REASON_MUST_DISCONNECT, input.canConnectWithReason_(output));

  connectionTest_tearDown();
}

function testCanConnectWithReason_DifferentWorkspaces() {
  connectionTest_setUp();

  input = new Blockly.Connection({workspace: {}}, Blockly.INPUT_VALUE);
  output = new Blockly.Connection({workspace: dummyWorkspace}, Blockly.OUTPUT_VALUE);

  assertEquals(Blockly.Connection.REASON_DIFFERENT_WORKSPACES, input.canConnectWithReason_(output));

  connectionTest_tearDown();
}


function testCanConnectWithReason_Self() {
  connectionTest_setUp();

  var block = {type_: "test block"};
  input.sourceBlock_ = block;
  assertEquals(Blockly.Connection.REASON_SELF_CONNECTION, input.canConnectWithReason_(input));

  connectionTest_tearDown();
}

function testCanConnectWithReason_Type() {
  connectionTest_setUp();

  assertEquals(Blockly.Connection.REASON_WRONG_TYPE, input.canConnectWithReason_(previous));
  assertEquals(Blockly.Connection.REASON_WRONG_TYPE, input.canConnectWithReason_(next));

  assertEquals(Blockly.Connection.REASON_WRONG_TYPE, output.canConnectWithReason_(previous));
  assertEquals(Blockly.Connection.REASON_WRONG_TYPE, output.canConnectWithReason_(next));

  assertEquals(Blockly.Connection.REASON_WRONG_TYPE, previous.canConnectWithReason_(input));
  assertEquals(Blockly.Connection.REASON_WRONG_TYPE, previous.canConnectWithReason_(output));

  assertEquals(Blockly.Connection.REASON_WRONG_TYPE, next.canConnectWithReason_(input));
  assertEquals(Blockly.Connection.REASON_WRONG_TYPE, next.canConnectWithReason_(output));

  connectionTest_tearDown();
}

function testCanConnectWithReason_CanConnect() {
  connectionTest_setUp();

  assertEquals(Blockly.Connection.CAN_CONNECT, previous.canConnectWithReason_(next));
  assertEquals(Blockly.Connection.CAN_CONNECT, next.canConnectWithReason_(previous));
  assertEquals(Blockly.Connection.CAN_CONNECT, input.canConnectWithReason_(output));
  assertEquals(Blockly.Connection.CAN_CONNECT, output.canConnectWithReason_(input));

  connectionTest_tearDown();
}

/**
 * The next set of tests checks that exceptions are being thrown at the correct times (external
 * view of errors).
 */
function testCheckConnection_Self() {
  connectionTest_setUp();
  var block = {type_: "test block"};
  input.sourceBlock_ = block;
  try {
    input.checkConnection_(input);
    fail();
  } catch (e) {
    // expected
  }

  connectionTest_tearDown();
}

function testCheckConnection_TypeInputPrev() {
  connectionTest_setUp();
  try {
    input.checkConnection_(previous);
    fail();
  } catch (e) {
    // expected
  }

  connectionTest_tearDown();
}

function testCheckConnection_TypeInputNext() {
  connectionTest_setUp();
  try {
    input.checkConnection_(next);
    fail();
  } catch (e) {
    // expected
  }

  connectionTest_tearDown();
}

function testCheckConnection_TypeOutputPrev() {
  connectionTest_setUp();
  try {
    output.checkConnection_(previous);
    fail();
  } catch (e) {
    // expected
  }

  connectionTest_tearDown();
}

function testCheckConnection_TypePrevInput() {
  connectionTest_setUp();
  try {
    previous.checkConnection_(input);
    fail();
  } catch (e) {
    // expected
  }

  connectionTest_tearDown();
}

function testCheckConnection_TypePrevOutput() {
  connectionTest_setUp();
  try {
    previous.checkConnection_(output);
    fail();
  } catch (e) {
    // expected
  }

  connectionTest_tearDown();
}

function testCheckConnection_TypeNextInput() {
  connectionTest_setUp();
  try {
    next.checkConnection_(input);
    fail();
  } catch (e) {
    // expected
  }

  connectionTest_tearDown();
}

function testCheckConnection_TypeNextOutput() {
  connectionTest_setUp();
  try {
    next.checkConnection_(output);
    fail();
  } catch (e) {
    // expected
  }

  connectionTest_tearDown();
}

function testCheckConnection_Okay() {
  connectionTest_setUp();
  previous.checkConnection_(next);
  next.checkConnection_(previous);
  input.checkConnection_(output);
  output.checkConnection_(input);

  connectionTest_tearDown();
}