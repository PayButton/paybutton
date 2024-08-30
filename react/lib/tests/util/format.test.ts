import { isTruthy } from "../../util"

describe('isPropsTrue', () => {
    it('returns true for "true" string', () => {
      expect(isTruthy("true")).toBe(true)
    })
    it('returns true for true boolean', () => {
      expect(isTruthy(true)).toBe(true)
    })
    it('returns false for "false" string', () => {
      expect(isTruthy("false")).toBe(false)
    })
    it('returns false for false boolean', () => {
      expect(isTruthy(false)).toBe(false)
    })
    it('returns false for other string', () => {
      expect(isTruthy("1")).toBe(false)
    })
    it('returns false for empty string', () => {
      expect(isTruthy("")).toBe(false)
    })
    it('returns false for "null" string', () => {
      expect(isTruthy("null")).toBe(false)
    })
})
