const cl = console.log

;(async () => {
  const db = IronDB.IronDB

  await db.set('hi', 'lolsup')

  cl('val', await db.get('hi'))
})()
