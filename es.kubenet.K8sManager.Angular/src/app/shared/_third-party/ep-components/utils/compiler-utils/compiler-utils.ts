export declare class CompilerUtilities {
  /**
     * @deprecated use mixClasses instead.
     *
     * Combines multiples classes into the specified `finalClass`.
     * **Constructors cannot be combined**
     *
     * @param finalClass The result class. Must not be empty.
     * @param classesToCombine An array of the given classes that will be combined into `finalClass`.
     * You do **not** need to specify `finalClass` here.
     */
  static applyMixins(finalClass: any, classesToCombine: any[]): void;
  /**
     * Combines multiples classes into the specified `finalClass`.
     * **Constructors cannot be combined**
     *
     * @param finalClass The result class. Must not be empty.
     * @param classesToCombine An array of the given classes that will be combined into `finalClass`.
     * You do **not** need to specify `finalClass` here.
     */
  static mixClasses(finalClass: any, classesToCombine: any[]): void;
}
