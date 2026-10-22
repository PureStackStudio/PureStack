export type TaskRunner = <T>(
  label: string,
  action: () => Promise<T>,
) => Promise<T>
