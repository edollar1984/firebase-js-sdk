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

import { ConfigInternal } from '../../model/auth';
import { debugAssert } from './assert';

export function _emulatorUrl(config: ConfigInternal, path?: string): string {
  debugAssert(config.emulator, 'Emulator should always be set here');
  const { hostname, port } = config.emulator;

  const base = `http://${hostname}:${port}`;
  if (!path) {
    return base;
  }

  const sep = path.startsWith('/') ? '' : '/';
  return `${base}${sep}${path}`;
}
