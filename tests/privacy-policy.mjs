import { createHash } from 'node:crypto';

export const forbiddenTextPattern = /15388581962|No\.96 Jinzhai Road|金寨路\s*96\s*号|22,000|approximately\s+50%|降低约\s*50%|CRAFT|zhc@liverpool\.ac\.uk|Haichao Zhang|XJTLU|Xi'an Jiaotong-Liverpool/i;
export const forbiddenPathPattern = /(?:^|\/)(?:cv|legacy)(?:\/|$)|haichao-zhang|portrait-haichao/i;

// Only irreversible fingerprints are stored so the private names never enter git history.
export const certificateContributorFingerprints = [
  { id: 'cn120029768b', length: 22, sha256: 'ba1bcabf9121b90567f5185aba79dc890e6b149fbe74fc33773825e063355f1c' },
  { id: 'cn121619724b', length: 20, sha256: '1bc9942db2e8cf9c64e96aad8e37438266265378f6718352c4549b89c8764bd1' },
  { id: '2020sr0059618', length: 17, sha256: 'c7dbd76eb00d5610eca5c1c0f212c33b4e5e3596357c18863ec8d1ef8d44da74' }
];

export const normalizePrivateText = (value) => value
  .normalize('NFKC')
  .replace(/[\p{P}\p{S}\s]+/gu, '');

const sha256 = (value) => createHash('sha256').update(value).digest('hex');

export const findPrivacyViolation = (value, fingerprints = certificateContributorFingerprints) => {
  if (forbiddenTextPattern.test(value)) return { kind: 'forbidden-public-content' };

  const normalized = normalizePrivateText(value);
  const characters = [...normalized];
  for (const fingerprint of fingerprints) {
    for (let start = 0; start <= characters.length - fingerprint.length; start += 1) {
      const candidate = characters.slice(start, start + fingerprint.length).join('');
      if (sha256(candidate) === fingerprint.sha256) {
        return { kind: 'certificate-contributor-list', id: fingerprint.id };
      }
    }
  }
  return null;
};
