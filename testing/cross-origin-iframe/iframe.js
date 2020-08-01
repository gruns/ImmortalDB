const cl = console.log

;(async () => {
  const db = ImmortalDB.ImmortalDB

  await db.set('hi', 'lolsup')

  cl('val', await db.get('hi'))
})()
