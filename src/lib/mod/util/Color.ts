/**
 * @description Represents a color used in an SVG file
 */
export default class Color {
  private literal: string;
  private static MAX_HEX_VAL = 16_777_216 as const;
  private static MAX_HEXA_VAL = 4_294_967_296 as const;
  private static MAX_RGB_COMPONENT = 255 as const;

  private constructor(literal: string) {
    this.literal = literal;
  }

  /**
   * @description Creates a new color with a hex number, for example, 0xffffff
   * matches the color #ffffff
   * @param value The provided hex number
   * @returns A color with a hex value
   */
  public static hex(value: number): Color {
    if (!Color.isValidHex(value)) {
      throw new RangeError("Specified value cannot be mapped to a hex color");
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
   * @description Creates a new color with a hex number, but with added
   *  transparency (the alpha value)
   * @param value The provided hexA number
   */
  public static hexA(value: number): Color {
    if (!Color.isValidHexA(value)) {
      throw new RangeError("Specified value cannot be mapped to a hex color");
    }
    const transformMap: Map<number, number> = new Map([
      [0xff000000, 16],
      [0xff0000, 16],
      [0xff00, 8],
      [0xff, 0],
    ]);

    let hexAString = "#";
    for (const [mask, shift] of transformMap) {
      const compValue = (value & mask) >> shift;
      let compStr = compValue.toString(16);

      if (compStr.length === 1) {
        compStr = `0${compStr}`;
      }
      hexAString += compStr;
    }

    if ((value & 0xff) === 0) {
      console.warn(
        `Color \"${value}\" is completely transparent, consider changing the alpha value`
      );
    }

    return new Color(hexAString);
  }

  /**
   * @description Creates a new color based on RGB values but converts the
   *  value to hex because both are can be mapped to one another
   * @param r red
   * @param g green
   * @param b blue
   */
  public static RGB(r: number, g: number, b: number): Color {
    const componentMap: Map<number, number> = new Map([
      [16, r],
      [8, g],
      [0, b],
    ]);
    let hexValue = 0;

    for (const [shift, component] of componentMap) {
      if (!this.isValidRGBComponent(component)) {
        throw new Error("Invalid color component provided");
      }

      let value = component << shift;
      hexValue += value;
    }
    let hexString = hexValue.toString(16);
    hexString = "#" + "0".repeat(6 - hexString.length) + hexString;

    return new Color(hexString);
  }

  /**
   * @description Creates a new color based on RGBA values and converts
   *  the specified value to hex
   */
  public static RGBA(r: number, g: number, b: number, a: number): Color {
    const componentMap: Map<number, number> = new Map([
      [24, r],
      [16, g],
      [8, b],
      [0, a],
    ]);
    let hexValue = 0;

    for (const [shift, component] of componentMap) {
      if (!this.isValidRGBComponent(component)) {
        throw new Error("Invalid color component provided");
      }

      let value = component << shift;
      hexValue += value;
    }

    let hexString = hexValue.toString(16);
    hexString = "#" + "0".repeat(8 - hexString.length) + hexString;

    return new Color(hexString);
  }

  /**
   * Checks if the provided number value can be mapped to a valid hexA color
   * @param value A provided hexA color
   * @returns True, if the provided value can be mapped to a hexA value, false
   *  otherwise
   */
  protected static isValidHexA(value: number): value is NonNullable<number> {
    return (
      value > 0 && value < this.MAX_HEXA_VAL && Math.floor(value) === value
    );
  }

  /**
   * Checks if the provided number value can be mapped to a valid hex color
   * @param value A provided hex color
   * @returns True if the provided value can be mapped to a hex value false
   *  otherwise
   */
  protected static isValidHex(value: number): value is NonNullable<number> {
    return value > 0 && value < this.MAX_HEX_VAL && Math.floor(value) === value;
  }

  /**
   * Checks if the provided value can be mapped to a valid RGB component value
   * @param value a provided RGB component
   * @returns True if the provided value can be mapped to an RGB component
   *  false otherwise
   */
  protected static isValidRGBComponent(
    value: number
  ): value is NonNullable<number> {
    return (
      value > 0 &&
      value <= this.MAX_RGB_COMPONENT &&
      Math.floor(value) === value
    );
  }

  /**
   * @description Gets the literal value of this color
   */
  public get getLiteral(): string {
    return this.literal;
  }
}
