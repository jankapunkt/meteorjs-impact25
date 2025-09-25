import { isomorphic } from './arch'

/**
 * SHA512 hash function
 * further reading:
 * @see https://dev.to/jankapunkt/write-isomorphic-code-in-meteorjs-19ko
 * @see https://dev.to/jankapunkt/meteor-browser-bundle-and-node-stubs-beware-what-you-import-342f
 * @type {function(string): string}
 * @param {string} input - input string
 * @returns {Promise<string>} hex-encoded SHA512 hash
 */
export const SHA512 = isomorphic({
  server () {
    import crypto from 'node:crypto';
    return async (input) => crypto.createHash('sha512').update(input, 'utf8').digest('hex');
  },
  client () {
    return async input => {
      const encoder = new TextEncoder()
      const data = encoder.encode(input)
      const hash = await window.crypto.subtle.digest({ name: 'SHA-512' }, data)
      const buffer = new Uint8Array(hash)
      const str = String.fromCharCode.apply(String, buffer)
      return Array.from(str).map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join('')
    }
  }
})
