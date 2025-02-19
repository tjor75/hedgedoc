/*
 * SPDX-FileCopyrightText: 2025 The HedgeDoc developers (see AUTHORS file)
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { formatChangedAt } from './format-date'

describe('formatChangedAt', () => {
  it('ISO String', () => {
    const result = formatChangedAt('2025-02-16T12:03:17+01:00')
    expect(result).toStrictEqual('vor 3 Tagen')
  })
})
