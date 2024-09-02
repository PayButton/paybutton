import { isPropsTrue } from "../../util"

describe('isPropsTrue', () => {
    it('returns true for "true" string', () => {
      expect(isPropsTrue("true")).toBe(true)
    })
    it('returns true for true boolean', () => {
      expect(isPropsTrue(true)).toBe(true)
    })
    it('returns false for "false" string', () => {
      expect(isPropsTrue("false")).toBe(false)
    })
    it('returns false for false boolean', () => {
      expect(isPropsTrue(false)).toBe(false)
    })
    it('returns false for other string', () => {
      expect(isPropsTrue("1")).toBe(false)
    })
    it('returns false for empty string', () => {
      expect(isPropsTrue("")).toBe(false)
    })
    it('returns false for "null" string', () => {
      expect(isPropsTrue("null")).toBe(false)
    })
    it('returns false for undefined', () => {
      expect(isPropsTrue(undefined)).toBe(false)
    })
})
