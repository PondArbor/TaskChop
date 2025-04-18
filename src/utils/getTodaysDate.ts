export default function () {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset()); // convert to local time
  return now.toISOString().split("T")[0];
}
