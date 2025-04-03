/**
 * @description An abstract class used to implement all other graph generators
 */
export default abstract class GraphGenerator {
  protected NAMESPACE_URL = "http://www.w3.org/2000/svg" as const;

  public abstract generateGraph(): void;
}
