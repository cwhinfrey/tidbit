export default async function (asyncFn) {
  try {
    return await asyncFn
  } catch (err) {
    console.error(err)
  }
}
