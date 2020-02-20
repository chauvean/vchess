export function checkNameEmail(o) {
  if (typeof o.name === "string") {
    if (o.name.length == 0) return "Empty name";
    if (!o.name.match(/^[\w]+$/)) return "Name: alphanumerics and underscore";
  }

  if (typeof o.email === "string") {
    if (o.email.length == 0) return "Empty email";
    if (!o.email.match(/^[\w.+-]+@[\w.+-]+$/)) return "Invalid email";
  }

  return "";
}
