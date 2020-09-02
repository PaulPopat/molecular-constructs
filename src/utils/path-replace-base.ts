export function ReplaceBase(
  path: string,
  current_base: string,
  new_base: string
) {
  const transformed_path = path.replace(/\\/gm, "/");
  let transformed_current_base = current_base.replace(/\\/gm, "/");
  if (transformed_current_base.endsWith("/")) {
    transformed_current_base = transformed_current_base.substr(
      0,
      transformed_current_base.length - 1
    );
  }
  let transformed_new_base = new_base.replace(/\\/gm, "/");
  if (transformed_new_base.endsWith("/")) {
    transformed_new_base = transformed_new_base.substr(
      0,
      transformed_new_base.length - 1
    );
  }
  return transformed_path.replace(
    transformed_current_base,
    transformed_new_base
  );
}
