export function getDateDetail(date) {
  const dt = parseInt(date.toString().slice(0, 10));
  const now = parseInt(new Date().getTime().toString().slice(0, 10));

  const time = dt - now;
  const sec = time % 60;
  const min = Math.floor(time / 60) % 60;
  const hour = Math.floor(time / 3600);

  return { hour, min, sec, time };
}