/**
 * @description Represents a color used in an SVG file
 */
export default class Color {
  private literal: string;
  private static MAX_HEX_VAL = 16_777_216 as const;

  private constructor(literal: string) {
    this.literal = literal;
  }

  /**
   * @description Creates a new color with a hex number, for example, 0xffffff
   * matches the color #ffffff
   * @returns A color with a hex value
   */
  public static hex(value: number): Color {
    if (!Color.isValidHex(value)) {
      throw new RangeError("Specificed value cannot be mapped to a hex color");
    }
    const transformMap: Map<number, number> = new Map([
      [0xff0000, 16],
      [0xff00, 8],
      [0xff, 0],
    ]);
    let hexString = "#";

    for (const [mask, shift] of transformMap) {
      const compValue = (value & mask) >> shift;
      let compStr = compValue.toString(16);

      if (compStr.length === 1) {
        compStr = `0${compStr}`;
      }
      hexString += compStr;
    }

    return new Color(hexString);
  }

  /**
   *
   * @param value A provided hex color
   * @returns If the provided value can be mapped to a hex value
   */
  static isValidHex(value: number): value is NonNullable<number> {
    return value > 0 && value < this.MAX_HEX_VAL && Math.floor(value) === value;
  }

  /**
   * @description Gets the literal value of this color
   */
  public get getLiteral(): string {
    return this.literal;
  }
}
