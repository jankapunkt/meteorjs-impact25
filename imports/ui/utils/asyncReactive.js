export const asyncReactive = (promise) => {
  const state = new ReactiveVar(false)
  Promise.resolve(promise)
    .catch((e) => console.error(e))
    .finally(() => state.set(true))
  return state
}
