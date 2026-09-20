export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function mergeStateClassName<State>(
  baseClassName: string,
  className?: string | ((state: State) => string | undefined)
) {
  if (typeof className === "function") {
    return (state: State) => cn(baseClassName, className(state));
  }

  return cn(baseClassName, className);
}
