/**
 * @license
 * Copyright 2020 Google LLC
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

import { _assert, AuthErrorCode } from '@firebase/auth-exp/internal';
import * as externs from '@firebase/auth-types-exp';
import { isIndexedDBAvailable, isNode, isReactNative } from '@firebase/util';
import { _isWebStorageSupported, _isWorker } from './platform';

export const Persistence = {
  LOCAL: 'LOCAL',
  NONE: 'NONE',
  SESSION: 'SESSION'
};

/**
 * Validates that an argument is a valid persistence value. If an invalid type
 * is specified, an error is thrown synchronously.
 */
export function _validatePersistenceArgument(
  auth: externs.Auth,
  persistence: string
): void {
  _assert(
    Object.values(Persistence).includes(persistence),
    auth,
    AuthErrorCode.INVALID_PERSISTENCE
  );
  // Validate if the specified type is supported in the current environment.
  if (isReactNative()) {
    // This is only supported in a browser.
    _assert(
      persistence !== Persistence.SESSION,
      auth,
      AuthErrorCode.UNSUPPORTED_PERSISTENCE
    );
    return;
  }
  if (isNode()) {
    // Only none is supported in Node.js.
    _assert(
      persistence === Persistence.NONE,
      auth,
      AuthErrorCode.UNSUPPORTED_PERSISTENCE
    );
    return;
  }
  if (_isWorker()) {
    // In a worker environment, either LOCAL or NONE are supported.
    // If indexedDB not supported and LOCAL provided, throw an error
    _assert(
      persistence === Persistence.NONE ||
        (persistence === Persistence.LOCAL && isIndexedDBAvailable()),
      auth,
      AuthErrorCode.UNSUPPORTED_PERSISTENCE
    );
    return;
  }
  // This is restricted by what the browser supports.
  _assert(
    persistence === Persistence.NONE || _isWebStorageSupported(),
    auth,
    AuthErrorCode.UNSUPPORTED_PERSISTENCE
  );
}
