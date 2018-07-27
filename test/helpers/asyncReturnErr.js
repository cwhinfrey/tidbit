export default async (asyncFn) => {
  try {
    await asyncFn
  } catch (err) {
    return err
  }
}
