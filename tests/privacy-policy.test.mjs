import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import test from 'node:test';

import { certificateContributorFingerprints, findPrivacyViolation, normalizePrivateText } from './privacy-policy.mjs';

test('privacy policy contains fingerprints for every certificate with a personal contributor list', () => {
  assert.equal(certificateContributorFingerprints.length, 3);
  for (const fingerprint of certificateContributorFingerprints) {
    assert.match(fingerprint.sha256, /^[a-f0-9]{64}$/);
    assert.ok(fingerprint.length > 0);
  }
});

test('privacy scanner rejects an injected complete contributor list without storing real names', () => {
  const syntheticList = '测试甲；测试乙；测试丙';
  const normalized = normalizePrivateText(syntheticList);
  const syntheticFingerprint = {
    id: 'synthetic-certificate',
    length: [...normalized].length,
    sha256: createHash('sha256').update(normalized).digest('hex')
  };

  assert.equal(findPrivacyViolation('<p>公开内容</p>', [syntheticFingerprint]), null);
  assert.deepEqual(
    findPrivacyViolation(`<p>作者：${syntheticList}</p>`, [syntheticFingerprint]),
    { kind: 'certificate-contributor-list', id: 'synthetic-certificate' }
  );
});
